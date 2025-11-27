from django.shortcuts import render

# Create your views here.
# chatapi/views.py

import json
import os
from typing import List, Dict, TypedDict, Optional, Any
import logging

# 需要安装 openai 库
# pip install openai

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache

import openai
from .knowledge_service import knowledge_service
from .models import ChatSimulationResult

logger = logging.getLogger(__name__)

LOW_SCORE_THRESHOLD = 25
HIGH_SCORE_THRESHOLD = 90
MAX_USER_TURNS = 20

END_REASON_LABELS = {
    "score_low": "得分过低，存在高风险",
    "score_high": "得分充足，防范意识优秀",
    "max_turns": "已达到最大演练轮次",
    "manual": "用户主动结束本轮演练",
}

CAPABILITY_KEYS = [
    ("risk_discernment", "风险识别"),
    ("info_protection", "信息保护"),
    ("response_speed", "响应速度"),
    ("emotional_control", "情绪稳定"),
    ("verification_skill", "核验能力"),
]

def evaluate_session_end(score: int, user_turns: int) -> Optional[str]:
    if score <= LOW_SCORE_THRESHOLD:
        return "score_low"
    if score >= HIGH_SCORE_THRESHOLD:
        return "score_high"
    if user_turns >= MAX_USER_TURNS:
        return "max_turns"
    return None


def heuristic_capability_profile(final_score: int) -> Dict[str, int]:
    base = max(0, min(100, final_score))
    adjustments = {
        "risk_discernment": base,
        "info_protection": int(base * 0.9 + 5),
        "response_speed": int(base * 0.8 + 10),
        "emotional_control": int(base * 0.85 + 8),
        "verification_skill": int(base * 0.95),
    }
    return {key: max(10, min(100, value)) for key, value in adjustments.items()}


def normalize_capability_profile(raw: Optional[Dict[str, Any]], fallback_score: int) -> Dict[str, int]:
    profile = {}
    if isinstance(raw, dict):
        for key, _ in CAPABILITY_KEYS:
            value = raw.get(key)
            if isinstance(value, (int, float)):
                profile[key] = max(0, min(100, int(value)))
    if len(profile) != len(CAPABILITY_KEYS):
        profile = heuristic_capability_profile(fallback_score)
    return profile


def default_report(final_score: int, scenario_type: str) -> Dict[str, Any]:
    if final_score >= 80:
        perf = f"你在本轮“{scenario_type}”演练中的表现较为稳健，最终得分 {final_score} 分。"
        sug = "继续保持质疑意识，并多练习识别不同渠道的骗术，巩固已有优势。"
    elif final_score >= 50:
        perf = f"你在本轮“{scenario_type}”演练中表现一般，最终得分 {final_score} 分，部分环节仍有提升空间。"
        sug = "遇到资金相关请求时先核验身份，多学习常见话术，提高甄别能力。"
    else:
        perf = f"本轮“{scenario_type}”演练得分 {final_score} 分，说明当前防骗策略较薄弱。"
        sug = "建议系统复盘对话，熟悉举报和核实流程，必要时参加更多演练巩固意识。"
    return {
        "performance_analysis": perf,
        "suggestions": sug,
        "capability_profile": heuristic_capability_profile(final_score),
    }


def build_report_prompt(
    scenario_type: str,
    difficulty: str,
    mode: str,
    final_score: int,
    conversation_rounds: int,
    end_reason: str,
    messages: List[Dict[str, str]],
) -> str:
    conversation_text = ""
    for msg in messages:
        sender = "用户" if msg.get("sender") == "user" else "AI"
        conversation_text += f"{sender}: {msg.get('content', '')}\n"

    reason_label = END_REASON_LABELS.get(end_reason, end_reason)

    return f"""你是一名专业的反诈骗训练教练，请根据以下对话生成总结报告。

对话信息：
场景：{scenario_type}
难度：{difficulty}
模式：{mode}
最终得分：{final_score}分
对话轮次：{conversation_rounds}轮
结束原因：{reason_label}

对话记录：
{conversation_text}

请输出JSON，包含 performance_analysis (150-200字) 与 suggestions (200-300字)，内容需结合实际对话表现、指出优缺点，并给出具体改进建议。
"""


def generate_report_data(
    scenario_type: str,
    difficulty: str,
    mode: str,
    final_score: int,
    conversation_rounds: int,
    end_reason: str,
    messages: List[Dict[str, str]],
) -> Dict[str, str]:
    prompt = build_report_prompt(
        scenario_type,
        difficulty,
        mode,
        final_score,
        conversation_rounds,
        end_reason,
        messages,
    )

    if not openai_client:
        logger.warning("AI client unavailable, falling back to default report")
        return default_report(final_score, scenario_type)

    try:
        completion = openai_client.chat.completions.create(
            model="qwen-flash",
            messages=[
                {
                    "role": "system",
                    "content": "你是专业的反诈骗训练教练，擅长撰写结构化中文报告。",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        ai_response = completion.choices[0].message.content

        cleaned = ai_response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        report_data = json.loads(cleaned)
        if "performance_analysis" in report_data and "suggestions" in report_data:
            profile = normalize_capability_profile(
                report_data.get("capability_profile"), final_score
            )
            return {
                "performance_analysis": report_data["performance_analysis"],
                "suggestions": report_data["suggestions"],
                "capability_profile": profile,
            }
        raise ValueError("missing report fields")
    except Exception as exc:
        logger.warning(f"generate_report_data fallback: {exc}")
        return default_report(final_score, scenario_type)


def persist_latest_result(
    user,
    scenario_type: str,
    difficulty: str,
    mode: str,
    final_score: int,
    conversation_rounds: int,
    end_reason: str,
    report_data: Dict[str, Any],
):
    with transaction.atomic():
        ChatSimulationResult.objects.update_or_create(
            user=user,
            defaults={
                "scenario_type": scenario_type,
                "difficulty": difficulty,
                "mode": mode,
                "final_score": final_score,
                "conversation_rounds": conversation_rounds,
                "end_reason": end_reason,
                "performance_analysis": report_data["performance_analysis"],
                "suggestions": report_data["suggestions"],
                "capability_profile": report_data.get("capability_profile", {}),
            },
        )

# --- 类型定义 (为了代码可读性，对应 Nuxt/H3 中的 interface) ---
class Message(TypedDict):
    role: str  # 'user', 'assistant', 'system'
    content: str

# 我们将把这个状态字典直接存在 session 中
class ConversationState(TypedDict):
    messages: List[Message]
    score: int
    # 注意：session 存储的数据需要是 JSON 序列化的 (默认数据库 backend 是这样)
    # 如果有自定义对象，需要特别处理序列化

# --- 初始化 OpenAI 客户端 ---
# 推荐在 settings.py 中加载环境变量，然后在 views.py 中导入使用
# 但为了直接对应你的原代码结构，我们在这里直接从 os.environ 获取
# 确保你的环境变量 DASHSCOPE_API_KEY 已经设置
DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")

# 如果 API key 未设置，这里可以根据需要抛出错误或记录警告
if not DASHSCOPE_API_KEY:
     logger.warning("DASHSCOPE_API_KEY environment variable not set. AI calls will likely fail.")
     openai_client = None
     # raise EnvironmentError("DASHSCOPE_API_KEY environment variable not set.") # 生产环境建议直接中断
else:
    logger.info("正在初始化OpenAI客户端")
    openai_client = openai.OpenAI(
        api_key=DASHSCOPE_API_KEY,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
    )
    logger.info("OpenAI客户端初始化成功")

# --- Django View 类 ---

@method_decorator(csrf_exempt, name='dispatch')
class ChatAPIView(APIView):
    """聊天API视图"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        处理用户聊天消息，使用Django Sessions进行状态管理，
        调用AI API，并返回响应。
        """
        # 使用一个唯一的 key 来存储会话状态在 session 中
        SESSION_STATE_KEY = 'chat_conversation_state'

        try:
            # 1. 读取并解析请求体
            user_message: Optional[str] = request.data.get('message')
            reset_conversation: Optional[bool] = request.data.get('reset')
            # 使用认证用户的ID
            user_id = str(request.user.id)
            
            logger.info(f"聊天请求来自用户: {user_id}")
            logger.debug(f"Django Session Key: {request.session.session_key}")


            # 2. 处理重置会话请求
            if reset_conversation:
                logger.info(f"重置用户 {user_id} 的会话状态")
                # 从 session 中删除对应的状态
                if SESSION_STATE_KEY in request.session:
                    del request.session[SESSION_STATE_KEY]

                # 返回成功响应
                return Response(
                    {'success': True, 'message': '会话状态重置成功'},
                    status=status.HTTP_200_OK
                )

            # 确保有用户消息，否则返回错误
            if not user_message or not isinstance(user_message, str):
                return Response(
                    {'success': False, 'message': '请求中缺少有效的消息内容'},
                    status=status.HTTP_400_BAD_REQUEST
                )


            # 3. 获取或初始化会话状态 from Session
            # 从 session 中获取状态，如果不存在，则为 None
            conversation_state: Optional[ConversationState] = request.session.get(SESSION_STATE_KEY)
            is_new_conversation = not conversation_state

            if is_new_conversation:
                logger.info(f"为用户 {user_id} 初始化新的会话状态")
                # 初始化分数和消息列表
                conversation_state = {'messages': [], 'score': 50} # 初始化分数

                # 新会话开始时，添加系统消息 (这是你原代码的一部分)
                # 注意：请在这里补充你的系统消息内容
                system_message_content = '''你是一个专业的反欺诈知识助手。你的任务是帮助用户了解各种诈骗手段，提供防范建议，解答相关问题。请以友善、专业的态度回答用户的问题，提供准确、实用的反诈骗知识和建议。不要模拟诈骗行为，而是要教育用户如何识别和防范诈骗。

每轮对话，在回复用户之前，你需要根据用户的最新回复，为用户在本轮的表现进行一个风险评分（基于用户的警惕性、是否泄露信息、是否听信你的诱导等）。评分范围是0-100分，初始分数为50分。
评分标准：
- 如果用户表现出高度警惕、怀疑、要求核实、提及报警或识破骗局，分数应该显著增加（例如10到30分）。
- 如果用户轻易相信你、按照你的指示操作、询问敏感信息、或表现出焦虑、不知所措，分数应该减少（例如-10到-30）。
- 如果用户直接泄露银行卡号、身份证号、验证码、密码等极端敏感信息，分数应大幅减少（例如-40到-60）。
- 如果用户只是进行普通交流，与骗局核心不相关，分数变化较小或不变。
- 如果用户一直重复无关内容，或是辱骂性内容，可进行显得有些气急败坏的威胁后主动结束对话，并增加少许评分。
请根据用户的具体用词、语气和行为来判断并给出分数。

你的回复必须遵循以下固定格式：
分数：[你的最新评分] 正文：[你扮演角色的回复文本]

例子如下（请注意不要复制此文本）：分数：75 正文：您好！关于您账户异常的问题，请提供一下您的账号信息以便我们核实。

回复文本的要求如下：
- 保持简短、清晰，避免冗余信息。
- 严格扮演你设定的诈骗角色，对话要自然、有说服力。
- 根据用户反应调整策略，深入或转移话题。
- 设计多样化的诈骗情境，每轮新对话都可以是一个全新的骗局（例如：冒充电商客服退款、冒充公检法、虚假投资平台、兼职刷单、杀猪盘等）。

请在你的第一条回复中，构思一个详细的诈骗背景故事和情境，然后以你扮演的角色身份向用户介绍这个场景，并以指定的格式输出（分数默认为50，因为这是第一条回复）。'''
                conversation_state['messages'].append({'role': 'system', 'content': system_message_content})
                logger.info(f"为用户 {user_id} 添加系统消息")

                # 将新的或修改后的状态存回 session
                request.session[SESSION_STATE_KEY] = conversation_state
                request.session.modified = True # 标记 session 已修改


            # 4. 分析用户消息的诈骗风险（知识图谱集成）
            risk_analysis = knowledge_service.analyze_fraud_risk(user_message)
            logger.info(f"用户 {user_id} 消息风险分析: 风险评分={risk_analysis['risk_score']}, 关键词数={len(risk_analysis['keywords'])}")
            
            # 如果检测到高风险内容，为AI提供额外的上下文信息
            knowledge_context = ""
            if risk_analysis['risk_score'] > 5:  # 风险评分大于5时提供知识图谱信息
                context_parts = []
                
                if risk_analysis['fraud_types']:
                    fraud_types_info = ", ".join([f"{ft['name']}({ft['risk_level']}风险)" for ft in risk_analysis['fraud_types']])
                    context_parts.append(f"检测到可能的诈骗类型: {fraud_types_info}")
                
                if risk_analysis['keywords']:
                    keywords_info = ", ".join([f"{kw['word']}(风险值{kw['risk_score']})" for kw in risk_analysis['keywords']])
                    context_parts.append(f"风险关键词: {keywords_info}")
                
                if risk_analysis['suggestions']:
                    suggestions_info = "; ".join([f"{s['name']}: {s['description']}" for s in risk_analysis['suggestions'][:3]])  # 最多3个建议
                    context_parts.append(f"防范建议: {suggestions_info}")
                
                if context_parts:
                    knowledge_context = f"\n\n[知识图谱分析] {' | '.join(context_parts)}"
            
            # 添加用户消息到会话状态（如果有知识图谱上下文，则附加到消息中）
            user_message_with_context = user_message + knowledge_context
            conversation_state['messages'].append({'role': 'user', 'content': user_message_with_context})
            logger.info(f"为用户 {user_id} 添加用户消息: {user_message[:50]}...")
            if knowledge_context:
                logger.info(f"为用户 {user_id} 添加知识图谱上下文: {knowledge_context[:100]}...")
            
            request.session[SESSION_STATE_KEY] = conversation_state
            request.session.modified = True # 标记 session 已修改

            # 5. 调用 AI API
            try:
                # 检查 OpenAI 客户端是否已初始化
                if openai_client is None:
                    logger.error(f"用户 {user_id} AI服务未配置: API密钥未设置")
                    return Response(
                        {'success': False, 'message': 'AI服务未配置，请联系管理员'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
                
                logger.info(f"为用户 {user_id} 调用AI API")
                # 调用 AI 时使用当前 session 中的消息历史
                chat_completion = openai_client.chat.completions.create(
                    model="deepseek-r1", # 请根据你实际使用的模型调整
                    messages=conversation_state['messages'] # 使用 session 中的消息历史
                )
                logger.info(f"用户 {user_id} 的AI API调用成功")

                # 6. 处理 AI 响应并更新状态 (使用从 session 中获取的状态)
                # 假设响应格式是标准的 OpenAI API 格式
                ai_reply_content = chat_completion.choices[0].message.content
                if not ai_reply_content:
                    # 如果 AI 返回空内容，根据需要处理，这里作为错误
                    raise ValueError("AI response content is empty.")

                # 添加 AI 响应到会话状态
                conversation_state['messages'].append({'role': 'assistant', 'content': ai_reply_content})
                logger.info(f"为用户 {user_id} 添加AI响应: {ai_reply_content[:50]}...")
                request.session[SESSION_STATE_KEY] = conversation_state
                request.session.modified = True # 标记 session 已修改

                # 7. 实现分数更新逻辑 - 解析AI响应中的分数
                import re
                
                # 解析AI响应中的分数和正文
                score_pattern = r'分数：(\d+)\s*正文：(.*)'
                match = re.match(score_pattern, ai_reply_content.strip(), re.DOTALL)
                
                if match:
                    # 提取分数和正文
                    new_score = int(match.group(1))
                    reply_text = match.group(2).strip()
                    
                    # 更新会话状态中的分数
                    conversation_state['score'] = max(0, min(100, new_score))  # 确保分数在 0-100 范围内
                    
                    # 更新AI消息内容为纯正文（去掉分数前缀）
                    conversation_state['messages'][-1]['content'] = reply_text
                    
                    logger.info(f"用户 {user_id} 分数更新为: {conversation_state['score']}")
                    
                    # 用于返回的AI回复内容
                    ai_reply_for_response = reply_text
                else:
                    # 如果无法解析分数格式，保持原有分数不变
                    logger.warning(f"用户 {user_id} 的AI响应格式不符合预期，无法解析分数: {ai_reply_content[:100]}...")
                    ai_reply_for_response = ai_reply_content
                
                # 保存更新后的状态到session
                request.session[SESSION_STATE_KEY] = conversation_state
                request.session.modified = True
                
                current_score = conversation_state['score']


                # 8. 返回响应
                return Response(
                    {
                        'success': True,
                        'response': ai_reply_for_response,  # 修改为response字段以匹配前端期望
                        'reply': ai_reply_for_response,     # 保留reply字段以兼容其他调用
                        'score': current_score,
                        'messages': conversation_state['messages'] # 返回 session 中的完整消息历史
                     },
                     status=status.HTTP_200_OK
                 )

            except openai.APIConnectionError as e:
                logger.error(f"用户 {user_id} 连接AI服务失败: {e}")
                return Response(
                    {'success': False, 'message': '连接AI服务失败'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except openai.RateLimitError as e:
                logger.error(f"用户 {user_id} AI服务请求频率超限: {e}")
                return Response(
                    {'success': False, 'message': 'AI服务请求频率超限，请稍后重试'},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            except openai.APIStatusError as e:
                logger.error(f"用户 {user_id} AI服务返回状态错误: {e.status_code} - {e.response}")
                return Response(
                    {'success': False, 'message': f'AI服务返回错误 (状态码: {getattr(e, "status_code", 500)})'},
                    status=getattr(e, 'status_code', status.HTTP_500_INTERNAL_SERVER_ERROR)
                )
            except ValueError as e:
                logger.error(f"用户 {user_id} AI响应内容错误: {e}")
                return Response(
                    {'success': False, 'message': f'AI返回无效响应: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as e:
                logger.error(f"用户 {user_id} AI调用过程中发生意外错误: {e}")
                return Response(
                    {'success': False, 'message': 'AI处理过程中发生意外错误'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            logger.error(f"处理用户 {request.user.id if hasattr(request, 'user') else 'unknown'} 请求时发生意外错误: {e}")
            return Response(
                {'success': False, 'message': '服务器发生意外错误'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# 保留原有的函数式视图作为备用
chat_api_view = ChatAPIView.as_view()


@method_decorator(csrf_exempt, name='dispatch')
class ChatHistoryView(APIView):
    """聊天历史记录视图"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """获取当前用户的聊天历史记录"""
        SESSION_STATE_KEY = 'chat_conversation_state'
        
        try:
            user_id = str(request.user.id)
            logger.info(f"获取用户 {user_id} 的聊天历史")
            
            # 从session中获取对话状态
            conversation_state = request.session.get(SESSION_STATE_KEY)
            
            if not conversation_state:
                return Response({
                    'success': True,
                    'data': {
                        'messages': [],
                        'score': 70,  # 默认分数
                        'session_id': request.session.session_key or 'new'
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': True,
                'data': {
                    'messages': conversation_state.get('messages', []),
                    'score': conversation_state.get('score', 70),
                    'session_id': request.session.session_key
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"获取用户 {user_id} 聊天历史失败: {e}")
            return Response({
                'success': False,
                'message': '获取聊天历史失败'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class GenerateReportAPIView(APIView):
    """生成对话分析报告的API视图"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """根据对话内容生成AI分析报告"""
        try:
            # 获取请求参数
            scenario_type = request.data.get('scenario_type')
            difficulty = request.data.get('difficulty')
            mode = request.data.get('mode')
            final_score = request.data.get('final_score')
            conversation_rounds = request.data.get('conversation_rounds')
            end_reason = request.data.get('end_reason')
            messages = request.data.get('messages', [])
            
            # 验证必需参数
            if not all([scenario_type, difficulty, mode, final_score is not None]):
                return Response({
                    'success': False,
                    'message': '缺少必需的参数'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 构建对话历史文本
            conversation_text = ""
            for msg in messages:
                if msg.get('sender') == 'user':
                    conversation_text += f"用户: {msg.get('content', '')}\n"
                elif msg.get('sender') == 'ai':
                    conversation_text += f"AI: {msg.get('content', '')}\n"
            
            # 生成报告分析的系统提示词
            report_prompt = f"""你是一名专业的反诈骗培训师，需要根据用户在反诈骗模拟对话中的表现生成详细的分析报告。

【对话信息】
场景类型: {scenario_type}
难度等级: {difficulty}
学习模式: {mode}
最终得分: {final_score}分
对话轮次: {conversation_rounds}轮
结束原因: {end_reason}

【对话记录】
{conversation_text}

请根据以上信息生成一份专业的分析报告，包含以下内容：

1. 表现评价（150-200字）：
   - 分析用户在对话中的防诈骗表现
   - 指出用户做得好的地方和需要改进的地方
   - 评价用户的警惕性和应对策略

2. 改进建议（200-300字）：
   - 针对用户的具体表现给出个性化建议
   - 提供实用的防诈骗技巧和方法
   - 推荐相关的学习资源或练习方向

请以JSON格式返回，包含performance_analysis和suggestions两个字段。

要求：
- 语言专业但易懂
- 建议具体可操作
- 鼓励用户继续学习
- 基于实际对话内容进行分析
"""
            
            # 调用AI生成报告
            if not openai_client:
                return Response({
                    'success': False,
                    'message': 'AI服务暂时不可用'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            completion = openai_client.chat.completions.create(
                model="qwen-flash",
                messages=[
                    {"role": "system", "content": "你是一名专业的反诈骗培训师，擅长分析用户的防诈骗表现并给出专业建议。"},
                    {"role": "user", "content": report_prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            ai_response = completion.choices[0].message.content
            logger.info(f"AI报告生成响应: {ai_response[:100]}...")
            
            # 尝试解析AI返回的JSON
            try:
                import json
                # 清理可能的markdown代码块标记
                cleaned_response = ai_response.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]
                cleaned_response = cleaned_response.strip()
                
                report_data = json.loads(cleaned_response)
                
                # 验证必需字段
                if 'performance_analysis' not in report_data or 'suggestions' not in report_data:
                    raise ValueError("AI响应缺少必需字段")
                
                return Response({
                    'success': True,
                    'performance_analysis': report_data['performance_analysis'],
                    'suggestions': report_data['suggestions']
                }, status=status.HTTP_200_OK)
                
            except (json.JSONDecodeError, ValueError, KeyError) as e:
                logger.warning(f"AI报告响应JSON解析失败: {e}, 原始响应: {ai_response}")
                
                # 如果JSON解析失败，返回默认报告
                default_performance = f"根据您在{scenario_type}场景中的表现，最终得分为{final_score}分。" + (
                    "您表现出了良好的防诈骗意识，能够识别诈骗行为并采取适当的应对措施。" if final_score >= 70 else
                    "您的防诈骗意识还需要进一步提高，建议多学习相关知识。"
                )
                
                default_suggestions = "建议您：1. 提高警惕性，对陌生人的要求保持怀疑；2. 不轻易透露个人信息；3. 遇到可疑情况及时咨询或报警；4. 定期学习最新的诈骗手段。"
                
                return Response({
                    'success': True,
                    'performance_analysis': default_performance,
                    'suggestions': default_suggestions
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"生成报告失败: {e}")
            return Response({
                'success': False,
                'message': f'生成报告时发生错误: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ChatSessionsView(APIView):
    """聊天会话管理视图"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """获取用户的会话列表（基于当前session）"""
        try:
            user_id = str(request.user.id)
            session_key = request.session.session_key
            
            # 由于使用Django Session，每个用户只有一个活跃会话
            # 这里返回当前会话的基本信息
            SESSION_STATE_KEY = 'chat_conversation_state'
            conversation_state = request.session.get(SESSION_STATE_KEY)
            
            if conversation_state and conversation_state.get('messages'):
                # 获取第一条用户消息作为会话标题
                first_user_message = None
                for msg in conversation_state['messages']:
                    if msg.get('role') == 'user':
                        first_user_message = msg.get('content', '')[:50] + '...'
                        break
                
                session_info = {
                    'id': session_key or 'current',
                    'title': first_user_message or '新对话',
                    'message_count': len(conversation_state['messages']),
                    'score': conversation_state.get('score', 70),
                    'created_at': None,  # Session没有创建时间信息
                    'updated_at': None
                }
            else:
                session_info = {
                    'id': session_key or 'new',
                    'title': '新对话',
                    'message_count': 0,
                    'score': 70,
                    'created_at': None,
                    'updated_at': None
                }
            
            return Response({
                'success': True,
                'data': {
                    'sessions': [session_info],
                    'total': 1,
                    'current_page': 1,
                    'total_pages': 1
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"获取用户 {user_id} 会话列表失败: {e}")
            return Response({
                'success': False,
                'message': '获取会话列表失败'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        """清空当前会话"""
        SESSION_STATE_KEY = 'chat_conversation_state'
        
        try:
            user_id = str(request.user.id)
            logger.info(f"清空用户 {user_id} 的会话")
            
            # 从session中删除对话状态
            if SESSION_STATE_KEY in request.session:
                del request.session[SESSION_STATE_KEY]
                request.session.modified = True
            
            return Response({
                'success': True,
                'message': '会话已清空'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"清空用户 {user_id} 会话失败: {e}")
            return Response({
                'success': False,
                'message': '清空会话失败'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ScenarioChatAPIView(APIView):
    """场景模拟聊天API视图"""
    permission_classes = [IsAuthenticated]
    
    @staticmethod
    def get_scenario_system_prompt(scenario_type, difficulty, mode):
        """根据场景类型、难度和模式生成系统提示词"""
        
        # 基础角色设定 (精简版)
        base_prompts = {
            'pig-butchering': {
                'role': '网络交友投资诈骗者',
                'background': '你通过网络交友建立感情，引导受害者进行虚假投资。',
                'tactics': ['建立信任', '展示收益', '制造紧迫', '要求转账'],
                'title': '杀猪盘诈骗'
            },
            'phishing': {
                'role': '网络钓鱼诈骗者', 
                'background': '你冒充官方机构，诱导用户点击链接或泄露信息。',
                'tactics': ['冒充官方', '制造风险', '要求验证', '发虚假链接'],
                'title': '网络钓鱼诈骗'
            },
            'fake-customer-service': {
                'role': '虚假客服',
                'background': '你冒充电商客服，以退款赔偿为由诱导转账。',
                'tactics': ['冒充客服', '声称问题', '要银行信息', '引导转账'],
                'title': '虚假客服诈骗'
            },
            'investment': {
                'role': '虚假投资顾问',
                'background': '你冒充专家，用高收益诱导用户投资虚假项目。',
                'tactics': ['展示专业', '承诺高收益', '制造稀缺', '要求资金'],
                'title': '虚假投资诈骗'
            },
            'loan': {
                'role': '虚假贷款专员',
                'background': '你冒充金融机构，以低息贷款诱导缴纳费用。',
                'tactics': ['承诺低息', '要预付费', '制造紧迫', '索要信息'],
                'title': '虚假贷款诈骗'
            }
        }
        
        # 难度等级设定 (精简版)
        difficulty_settings = {
            'easy': {
                'desc': '初级难度',
                'behavior': '手段粗糙，频繁暴露破绽，逻辑有漏洞，急于求成。',
            },
            'medium': {
                'desc': '中级难度',
                'behavior': '手段较专业但有迹可循，关键时刻露破绽，循序渐进。',
            },
            'hard': {
                'desc': '高级难度',
                'behavior': '手段极专业隐蔽，话术严密，擅长心理操控，极难识破。',
            }
        }
        
        # 学习模式设定 (精简版)
        mode_settings = {
            'mixed': {
                'desc': '真假混合模式',
                'behavior': '随机扮演真实或虚假角色。真实则专业诚信；虚假则模拟诈骗。保持角色一致。',
            },
            'pure_fake': {
                'desc': '纯假模式',
                'behavior': '使用典型诈骗手法，帮助用户识别特征。',
            }
        }
        
        scenario = base_prompts.get(scenario_type, base_prompts['pig-butchering'])
        diff_set = difficulty_settings.get(difficulty, difficulty_settings['medium'])
        mode_set = mode_settings.get(mode, mode_settings['pure_fake'])
        
        # 开场白 (精简)
        opening_lines = {
            'pig-butchering': [
                '你好，看你朋友圈生活很精彩，我是做投资的，有个好项目想分享给你。',
                '嗨，之前聊过还记得吗？最近有个内部投资机会收益不错。',
            ],
            'phishing': [
                '【系统通知】您的账户存在异常，请立即点击链接验证身份，否则将冻结。',
                '【支付安全】检测到风险交易，请及时验证身份信息。',
            ],
            'fake-customer-service': [
                '您好，我是客服，您购买的商品有质量问题，需验证银行卡为您退款。',
                '亲，您的快递丢失了，我们将双倍赔偿，请提供收款账户。',
            ],
            'investment': [
                '恭喜！您被选中参与VIP项目，日收益20%，无风险保本！',
                '我是投资顾问，这里有个内部高收益项目，名额有限。',
            ],
            'loan': [
                '您好！我们可以提供无抵押低息贷款，当天放款，仅需少量保证金。',
                '恭喜通过贷款预审，额度30万，请缴纳激活费以放款。',
            ]
        }
        
        import random
        if scenario_type not in opening_lines: scenario_type = 'pig-butchering'
        opening_line = random.choice(opening_lines[scenario_type])
        
        is_real_scenario = False
        if mode == 'mixed': is_real_scenario = random.choice([True, False])
        
        # 构建系统提示词 (大幅精简)
        if mode == 'mixed' and is_real_scenario:
            system_prompt = f"""你是一个反诈训练系统的AI。当前是【真实场景】。
角色：合法的{scenario['title']}服务者。
行为：提供真实信息，遵循商业规范，专业诚信，无欺诈。
开场白："{opening_line}"

【评分规则】(初始50分)
加分(+5~20)：信任真实服务、合理验证、适度警惕。
扣分(-5~15)：过度怀疑、无理由拒绝、缺乏辨别力。
用户识别出是真实服务得高分。

【回复格式(JSON)】
{{
  "content": "回复内容",
  "current_score": 0-100,
  "score_change": 变化值(如 5, -10),
  "change_reason": "原因"
}}

【规则】
1. 坚守真实身份，不承认是AI。
2. 面对质疑提供合理证明。
3. 严格按JSON格式回复。
"""
        else:
             system_prompt = f"""你是一个反诈训练系统的AI。当前是【虚假诈骗场景】。
角色：{scenario['role']}。
背景：{scenario['background']}
难度：{diff_set['desc']} - {diff_set['behavior']}
策略：{', '.join(scenario['tactics'])}
开场白："{opening_line}"

【评分规则】(初始50分)
加分(+5~25)：怀疑、验证身份、拒绝提供信息/转账、识破骗局(+20)、报警(+25)。
扣分(-5~20)：轻信、提供信息、同意转账、被操控。
用户说"你是骗子"时必须加分！

【回复格式(JSON)】
{{
  "content": "回复内容",
  "current_score": 0-100,
  "score_change": 变化值(如 5, -10),
  "change_reason": "原因"
}}

【规则】
1. 坚守骗子人设，绝不承认是AI或在训练。
2. 被识破时要否认、狡辩或卖惨，不能跳戏。
3. 严格按JSON格式回复。
4. 只有用户被骗才扣分，防范成功则加分。
"""
        
        return system_prompt
    
    def post(self, request):
        """处理场景模拟聊天消息"""
        try:
            # 获取请求参数
            user_message = request.data.get('message')
            reset_conversation = request.data.get('reset')
            scenario_type = request.data.get('scenario_type', 'pig-butchering')
            difficulty = request.data.get('difficulty', 'medium')
            mode = request.data.get('mode', 'pure')
            user_id = str(request.user.id)
            
            # 为每个场景类型创建独立的会话状态键，确保不同场景间完全隔离
            SESSION_STATE_KEY = f'scenario_chat_{scenario_type}_{user_id}'
            
            logger.info(f"场景模拟聊天请求来自用户: {user_id}, 场景: {scenario_type}, 难度: {difficulty}, 模式: {mode}")
            
            # 处理重置会话请求
            if reset_conversation:
                logger.info(f"重置用户 {user_id} 的场景模拟会话状态: {scenario_type}")
                if SESSION_STATE_KEY in request.session:
                    del request.session[SESSION_STATE_KEY]
                return Response(
                    {'success': True, 'message': f'场景模拟会话状态重置成功: {scenario_type}'},
                    status=status.HTTP_200_OK
                )
            
            # 验证用户消息
            if not user_message or not isinstance(user_message, str):
                return Response(
                    {'success': False, 'message': '请求中缺少有效的消息内容'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 获取或初始化会话状态
            conversation_state = request.session.get(SESSION_STATE_KEY)
            is_new_conversation = not conversation_state
            
            if is_new_conversation:
                logger.info(f"为用户 {user_id} 初始化新的场景模拟会话状态")
                conversation_state = {'messages': [], 'score': 50}
                
                # 生成场景特定的系统提示词
                system_message_content = self.get_scenario_system_prompt(scenario_type, difficulty, mode)
                
                system_message: Message = {
                    'role': 'system',
                    'content': system_message_content
                }
                conversation_state['messages'].append(system_message)
            
            # 添加用户消息
            user_msg: Message = {
                'role': 'user', 
                'content': user_message
            }
            conversation_state['messages'].append(user_msg)
            
            # 调用AI API
            if not openai_client:
                return Response(
                    {'success': False, 'message': 'AI服务暂时不可用'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            logger.info(f"调用AI API，消息数量: {len(conversation_state['messages'])}")
            
            # 准备发送给AI的消息（排除系统消息以节省token）
            messages_for_ai = conversation_state['messages'][-10:]  # 只保留最近10条消息
            
            completion = openai_client.chat.completions.create(
                model="qwen-flash",
                messages=messages_for_ai,
                temperature=0.7,
                max_tokens=1000
            )
            
            ai_response = completion.choices[0].message.content
            logger.info(f"AI响应: {ai_response[:100]}...")
            
            # 尝试解析AI返回的JSON格式
            try:
                import json
                # 清理可能的markdown代码块标记
                cleaned_response = ai_response.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]
                cleaned_response = cleaned_response.strip()
                
                # 修复score_change字段中的+号问题
                import re
                cleaned_response = re.sub(r'"score_change":\s*\+([0-9]+)', r'"score_change": \1', cleaned_response)
                
                ai_data = json.loads(cleaned_response)
                
                # 验证必需字段
                required_fields = ['content', 'current_score', 'score_change', 'change_reason']
                if not all(field in ai_data for field in required_fields):
                    raise ValueError("缺少必需的JSON字段")
                
                # 更新会话状态中的分数
                conversation_state['score'] = ai_data['current_score']
                
                # 添加AI回复到对话历史（保存原始内容）
                ai_msg: Message = {
                    'role': 'assistant',
                    'content': ai_response
                }
                conversation_state['messages'].append(ai_msg)
                
                # 保存会话状态到session
                request.session[SESSION_STATE_KEY] = conversation_state
                request.session.modified = True
                
                # 返回结构化响应
                return Response({
                    'success': True,
                    'response': ai_data['content'],
                    'current_score': ai_data['current_score'],
                    'score_change': ai_data['score_change'],
                    'change_reason': ai_data['change_reason'],
                    'message_count': len(conversation_state['messages'])
                }, status=status.HTTP_200_OK)
                
            except (json.JSONDecodeError, ValueError, KeyError) as e:
                logger.warning(f"AI响应JSON解析失败: {e}, 原始响应: {ai_response}")
                
                # 如果JSON解析失败，返回原始响应（向后兼容）
                ai_msg: Message = {
                    'role': 'assistant',
                    'content': ai_response
                }
                conversation_state['messages'].append(ai_msg)
                
                request.session[SESSION_STATE_KEY] = conversation_state
                request.session.modified = True
                
                return Response({
                    'success': True,
                    'response': ai_response,
                    'current_score': conversation_state['score'],
                    'score_change': 0,
                    'change_reason': '格式解析失败',
                    'message_count': len(conversation_state['messages'])
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"场景模拟聊天处理失败: {e}")
            return Response({
                'success': False,
                'message': f'处理请求时发生错误: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@method_decorator(csrf_exempt, name="dispatch")
class ScenarioChatStatelessAPIView(APIView):
    """Stateless scenario chat endpoint supporting manual termination."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_message = request.data.get('message')
            reset_conversation = request.data.get('reset')
            init_conversation = request.data.get('init')
            force_end = bool(request.data.get('force_end'))
            scenario_type = request.data.get('scenario_type', 'pig-butchering')
            difficulty = request.data.get('difficulty', 'medium')
            mode = request.data.get('mode', 'pure')
            history_messages = request.data.get('history', [])
            current_score = request.data.get('current_score', 50)

            if reset_conversation:
                return Response({'success': True, 'message': 'stateless session reset'}, status=status.HTTP_200_OK)

            if init_conversation:
                # Initialize conversation with system prompt and return the opening line
                system_prompt = ScenarioChatAPIView.get_scenario_system_prompt(scenario_type, difficulty, mode)
                
                # Extract opening line from system prompt
                import re
                match = re.search(r'你的第一句话应该是："(.*?)"', system_prompt)
                opening_line = match.group(1) if match else "你好。"
                
                return Response({
                    'success': True,
                    'response': opening_line,
                    'session_closed': False,
                    'message_count': 1,
                    'current_score': 50,
                    'score_change': 0,
                    'change_reason': '初始对话',
                }, status=status.HTTP_200_OK)

            if not force_end and (not user_message or not isinstance(user_message, str)):
                return Response({'success': False, 'message': '请求中缺少有效的消息内容'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                score_value = int(current_score)
            except (TypeError, ValueError):
                score_value = 50

            conversation_state: ConversationState = {
                'messages': [],
                'score': max(0, min(100, score_value))
            }
            system_prompt = ScenarioChatAPIView.get_scenario_system_prompt(scenario_type, difficulty, mode)
            conversation_state['messages'].append({'role': 'system', 'content': system_prompt})

            history_payload: List[Dict[str, str]] = []
            report_messages: List[Dict[str, str]] = []
            if isinstance(history_messages, list):
                for msg in history_messages:
                    role = 'user' if msg.get('role') == 'user' else 'assistant'
                    content = msg.get('content', '')
                    if not content:
                        continue
                    history_payload.append({'role': role, 'content': content})
                    report_messages.append({'sender': 'user' if role == 'user' else 'ai', 'content': content})

            user_turns = len([msg for msg in report_messages if msg['sender'] == 'user'])

            if force_end:
                if not report_messages:
                    return Response({'success': False, 'message': '当前对话为空，无法结算'}, status=status.HTTP_400_BAD_REQUEST)

                report_data = generate_report_data(
                    scenario_type=scenario_type,
                    difficulty=difficulty,
                    mode=mode,
                    final_score=score_value,
                    conversation_rounds=user_turns,
                    end_reason='manual',
                    messages=report_messages,
                )
                persist_latest_result(
                    user=request.user,
                    scenario_type=scenario_type,
                    difficulty=difficulty,
                    mode=mode,
                    final_score=score_value,
                    conversation_rounds=user_turns,
                    end_reason='manual',
                    report_data=report_data,
                )

                return Response({
                    'success': True,
                    'response': '本轮演练已手动结束。',
                    'session_closed': True,
                    'final_score': score_value,
                    'end_reason': 'manual',
                    'end_reason_label': END_REASON_LABELS.get('manual', '用户主动结束本轮演练'),
                    'performance_analysis': report_data['performance_analysis'],
                    'suggestions': report_data['suggestions'],
                    'conversation_rounds': user_turns,
                    'scenario_type': scenario_type,
                    'difficulty': difficulty,
                    'mode': mode,
                    'capability_profile': report_data['capability_profile'],
                }, status=status.HTTP_200_OK)

            if (
                not history_payload
                or history_payload[-1]['role'] != 'user'
                or history_payload[-1]['content'] != user_message
            ):
                history_payload.append({'role': 'user', 'content': user_message})
                report_messages.append({'sender': 'user', 'content': user_message})
                user_turns += 1

            conversation_state['messages'].extend(history_payload)

            if not openai_client:
                return Response({'success': False, 'message': 'AI服务暂时不可用'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            messages_for_ai = conversation_state['messages'][-10:]
            completion = openai_client.chat.completions.create(
                model="qwen-flash",
                messages=messages_for_ai,
                temperature=0.7,
                max_tokens=1000
            )

            ai_response = completion.choices[0].message.content

            try:
                cleaned_response = ai_response.strip()
                if cleaned_response.startswith('```json'):
                    cleaned_response = cleaned_response[7:]
                if cleaned_response.endswith('```'):
                    cleaned_response = cleaned_response[:-3]
                cleaned_response = cleaned_response.strip()

                import re
                cleaned_response = re.sub(r'"score_change":\s*\+([0-9]+)', r'"score_change": ', cleaned_response)

                ai_data = json.loads(cleaned_response)
                for field in ['content', 'current_score', 'score_change', 'change_reason']:
                    if field not in ai_data:
                        raise ValueError('invalid payload')

                conversation_state['messages'].append({'role': 'assistant', 'content': ai_response})

                end_reason = evaluate_session_end(ai_data['current_score'], user_turns)
                session_closed = end_reason is not None

                response_payload: Dict[str, Any] = {
                    'success': True,
                    'response': ai_data['content'],
                    'session_closed': session_closed,
                    'message_count': len(conversation_state['messages']),
                }

                if session_closed:
                    report_messages.append({'sender': 'ai', 'content': ai_data['content']})
                    report_data = generate_report_data(
                        scenario_type=scenario_type,
                        difficulty=difficulty,
                        mode=mode,
                        final_score=ai_data['current_score'],
                        conversation_rounds=user_turns,
                        end_reason=end_reason,
                        messages=report_messages,
                    )
                    persist_latest_result(
                        user=request.user,
                        scenario_type=scenario_type,
                        difficulty=difficulty,
                        mode=mode,
                        final_score=ai_data['current_score'],
                        conversation_rounds=user_turns,
                        end_reason=end_reason,
                        report_data=report_data,
                    )

                    response_payload.update({
                        'final_score': ai_data['current_score'],
                        'end_reason': end_reason,
                        'end_reason_label': END_REASON_LABELS.get(end_reason, end_reason),
                        'performance_analysis': report_data['performance_analysis'],
                        'suggestions': report_data['suggestions'],
                        'conversation_rounds': user_turns,
                        'scenario_type': scenario_type,
                        'difficulty': difficulty,
                        'mode': mode,
                        'capability_profile': report_data['capability_profile'],
                    })
                else:
                    response_payload.update({
                        'current_score': None,
                        'score_change': None,
                        'change_reason': None,
                    })

                return Response(response_payload, status=status.HTTP_200_OK)

            except (json.JSONDecodeError, ValueError, KeyError) as e:
                logger.warning(f"Stateless scenario JSON parse failed: {e}, raw: {ai_response}")
                conversation_state['messages'].append({'role': 'assistant', 'content': ai_response})
                return Response({
                    'success': True,
                    'response': ai_response,
                    'session_closed': False,
                    'message_count': len(conversation_state['messages']),
                    'current_score': None,
                    'score_change': 0,
                    'change_reason': '格式解析失败',
                }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Stateless scenario chat failed: {e}")
            return Response({'success': False, 'message': f'处理请求时出现异常: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LatestSimulationResultAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            result = ChatSimulationResult.objects.get(user=request.user)
        except ChatSimulationResult.DoesNotExist:
            return Response({'has_result': False}, status=status.HTTP_200_OK)

        return Response({
            'has_result': True,
            'data': {
                'scenario_type': result.scenario_type,
                'difficulty': result.difficulty,
                'mode': result.mode,
                'final_score': result.final_score,
                'conversation_rounds': result.conversation_rounds,
                'end_reason': result.end_reason,
                'end_reason_label': END_REASON_LABELS.get(result.end_reason, result.end_reason),
                'performance_analysis': result.performance_analysis,
                'suggestions': result.suggestions,
                'updated_at': result.created_at.isoformat(),
                'capability_profile': result.capability_profile or {},
            }
        }, status=status.HTTP_200_OK)

