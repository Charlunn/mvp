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
            model="qwen-plus",
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
        
        # 基础角色设定
        base_prompts = {
            'pig-butchering': {
                'role': '网络交友投资诈骗者',
                'background': '你是一个通过网络交友进行投资诈骗的骗子。你会先与受害者建立感情联系，然后逐步引导他们进行虚假投资。',
                'tactics': ['建立信任关系', '展示虚假收益', '制造紧迫感', '要求转账投资'],
                'title': '杀猪盘诈骗模拟'
            },
            'phishing': {
                'role': '网络钓鱼诈骗者', 
                'background': '你冒充银行、支付平台等官方机构，通过虚假通知诱导用户点击恶意链接或泄露个人信息。',
                'tactics': ['冒充官方身份', '制造账户风险', '要求验证信息', '发送虚假链接'],
                'title': '网络钓鱼诈骗模拟'
            },
            'fake-customer-service': {
                'role': '虚假客服诈骗者',
                'background': '你冒充电商平台客服，以退款、赔偿等理由诱导用户提供银行卡信息或进行转账操作。',
                'tactics': ['冒充客服身份', '声称商品问题', '要求银行信息', '引导转账操作'],
                'title': '虚假客服诈骗模拟'
            },
            'investment': {
                'role': '虚假投资诈骗者',
                'background': '你冒充投资顾问或理财专家，通过虚假的高收益投资项目诱导用户投资。',
                'tactics': ['展示专业形象', '承诺高收益', '制造稀缺性', '要求投资资金'],
                'title': '虚假投资诈骗模拟'
            },
            'loan': {
                'role': '虚假贷款诈骗者',
                'background': '你冒充正规金融机构，以低息贷款为诱饵，要求用户缴纳各种费用。',
                'tactics': ['承诺低息贷款', '要求预付费用', '制造放款紧迫感', '索要个人信息'],
                'title': '虚假贷款诈骗模拟'
            }
        }
        
        # 难度等级设定 - 详细说明确保AI理解
        difficulty_settings = {
            'easy': {
                'description': '初级难度 - 诈骗手段明显，容易识破',
                'behavior': '你的诈骗手段比较粗糙和明显，会频繁暴露破绽。说话方式不够专业，经常出现逻辑漏洞，用词不当，容易让人产生怀疑。你会急于求成，过早暴露诈骗意图。',
                'ai_hints': '在初级难度下，你应该表现得不够专业，让用户容易识别诈骗特征。'
            },
            'medium': {
                'description': '中级难度 - 诈骗手段较为隐蔽，需要一定警惕性',
                'behavior': '你的诈骗手段比较专业，但仍有可以识别的特征。你会表现得相对专业，但在关键时刻会露出破绽。你懂得循序渐进，不会过于急躁，但在细节上可能出现不一致。',
                'ai_hints': '在中级难度下，你需要平衡专业性和可识别性，让有一定防范意识的用户能够识破。'
            },
            'hard': {
                'description': '高级难度 - 诈骗手段非常专业隐蔽，极难识破',
                'behavior': '你是经验丰富的诈骗者，手段非常专业和隐蔽。你的话术流畅自然，逻辑严密，能够巧妙应对质疑。你懂得心理操控，能够营造紧迫感和信任感。只有非常警惕和有经验的人才能识破你的诈骗。',
                'ai_hints': '在高级难度下，你需要表现得极其专业，只在非常细微的地方留下可供识别的线索。'
            }
        }
        
        # 学习模式设定 - 详细说明确保AI理解
        mode_settings = {
            'mixed': {
                'description': '真假混合模式 - 随机为真实或虚假场景，训练用户辨别能力',
                'behavior': '系统会随机分配你扮演真实或虚假角色。如果是真实角色，你要提供合理、真实的信息和服务，行为符合正常商业或社交规范，保持专业和诚信。如果是虚假角色，你要模拟诈骗分子的行为和话术，使用常见的诈骗手段和套路，试图获取用户信息或金钱。无论真假，都要保持角色一致性，不要主动暴露自己的性质。',
                'ai_hints': '在混合模式下，根据随机分配的真假性质进行对话，真实场景提供合理信息，虚假场景模拟诈骗，让用户学会辨别真假。',
                'scoring_rules': {
                    'excellent_discrimination': {
                        'description': '准确辨别真假，采取合适应对措施',
                        'score_range': (9, 10),
                        'criteria': [
                            '正确识别场景真假性质',
                            '对真实场景给予合理信任',
                            '对虚假场景保持警惕并拒绝',
                            '通过合理询问验证信息'
                        ]
                    },
                    'good_caution': {
                        'description': '表现出适度警觉，但判断略有偏差',
                        'score_range': (7, 8),
                        'criteria': [
                            '对可疑信息保持警惕',
                            '尝试验证信息真实性',
                            '避免极端反应（过度信任或完全拒绝）'
                        ]
                    },
                    'moderate_response': {
                        'description': '有基本防范意识但辨别能力不足',
                        'score_range': (5, 6),
                        'criteria': [
                            '有一定怀疑但判断不准确',
                            '询问方式不够有效',
                            '容易被表面现象迷惑'
                        ]
                    },
                    'poor_discrimination': {
                        'description': '辨别能力差，容易误判',
                        'score_range': (3, 4),
                        'criteria': [
                            '盲目轻信虚假信息',
                            '或无理由拒绝真实服务',
                            '缺乏有效的验证手段'
                        ]
                    },
                    'very_poor': {
                        'description': '完全缺乏辨别能力',
                        'score_range': (1, 2),
                        'criteria': [
                            '对明显诈骗完全不设防',
                            '或对正常服务过度敌视',
                            '没有任何风险意识'
                        ]
                    }
                }
            },
            'pure_fake': {
                'description': '纯假学习模式 - 完全虚假的诈骗场景，用于学习识别技巧',
                'behavior': '你使用明显的诈骗手法和典型话术，帮助用户清晰地学习和识别诈骗特征。你会表现出明显的诈骗者特征，如急于求成、逻辑漏洞、用词不当等，让用户能够容易识别并学习防范要点。',
                'ai_hints': '在纯假学习模式下，使用典型的诈骗话术和手法，让用户能够清晰地学习和识别诈骗特征。',
                'scoring_rules': {
                    'high_risk_response': {
                        'description': '用户识别出高风险行为并采取正确应对措施',
                        'score_range': (8, 10),
                        'criteria': [
                            '正确识别诈骗特征',
                            '拒绝提供个人信息',
                            '拒绝转账或付款',
                            '表现出合理怀疑'
                        ]
                    },
                    'medium_risk_response': {
                        'description': '用户有一定警觉性但应对不够完善',
                        'score_range': (5, 7),
                        'criteria': [
                            '部分识别风险信号',
                            '有所怀疑但不够坚决',
                            '询问但未深入验证'
                        ]
                    },
                    'low_risk_response': {
                        'description': '用户缺乏警觉性，容易上当',
                        'score_range': (1, 4),
                        'criteria': [
                            '轻易相信对方',
                            '主动提供个人信息',
                            '同意转账或付款',
                            '未表现出任何怀疑'
                        ]
                    }
                }
            }
        }
        
        scenario = base_prompts.get(scenario_type, base_prompts['pig-butchering'])
        difficulty_setting = difficulty_settings.get(difficulty, difficulty_settings['medium'])
        mode_setting = mode_settings.get(mode, mode_settings['pure_fake'])
        
        # 生成随机开场白
        opening_lines = {
            'pig-butchering': [
                '你好，我是通过朋友介绍认识你的，看你朋友圈生活很精彩呢！我最近在做一些投资，收益还不错，要不要了解一下？',
                '嗨，我们之前在某个群里聊过，你还记得吗？我最近发现了一个很好的投资机会，想和你分享一下。',
                '你好！我是做金融投资的，看你很有眼光，想和你交流一下投资心得。',
                '朋友你好，我在投资圈混了很多年，最近有个内部项目，收益很稳定，有兴趣了解吗？'
            ],
            'phishing': [
                '【银行通知】您的账户存在异常登录，请立即点击链接验证身份，否则将冻结账户。',
                '【支付宝安全中心】检测到您的账户有风险交易，请及时验证身份信息。',
                '【微信支付】您的账户出现异常，需要重新绑定银行卡，请点击链接处理。',
                '【中国银行】系统升级需要验证客户信息，请配合完成身份验证。'
            ],
            'fake-customer-service': [
                '您好，我是淘宝客服，您购买的商品存在质量问题，我们将为您办理退款，需要验证您的银行卡信息。',
                '亲，您的订单出现问题，快递丢失了，我们会给您双倍赔偿，请提供收款账户。',
                '您好，我是京东客服，您的包裹被海关扣留，需要缴纳关税才能放行。',
                '您购买的商品有质量问题，我们将进行赔付，请添加我的微信详细沟通。'
            ],
            'investment': [
                '恭喜您！您被选中参与我们的VIP投资项目，最低投资1000元，日收益20%，无风险保本，机会难得！',
                '您好，我是专业投资顾问，看您很有投资眼光，我这里有个内部项目，收益稳定，要不要了解一下？',
                '朋友推荐您加入我们的投资群，这里都是成功人士，每天分享赚钱机会，您有兴趣吗？',
                '我们平台新用户注册就送1000元体验金，投资收益可以直接提现，您要不要试试？'
            ],
            'loan': [
                '您好！我们是XX金融，可为您提供无抵押贷款，额度最高50万，当天放款，只需缴纳保证金。',
                '恭喜您通过我们的贷款预审，可获得30万额度，需要先缴纳2000元激活费用。',
                '您的贷款申请已通过，我们是正规金融机构，放款前需要验证还款能力。',
                '您好，我们可以为您提供低息贷款，手续简单，只需要缴纳少量手续费即可。'
            ]
        }
        
        import random
        # 确保场景类型匹配，如果不匹配则使用默认场景
        if scenario_type not in opening_lines:
            scenario_type = 'pig-butchering'  # 默认场景
        opening_line = random.choice(opening_lines[scenario_type])
        
        # 获取当前模式的评分细则
        current_mode_config = mode_settings.get(mode, mode_settings['pure_fake'])
        scoring_rules = current_mode_config.get('scoring_rules', {})
        
        # 构建评分细则文本
        scoring_text = "\n".join([
            f"{rule_name}: {rule_data['description']} (分数范围: {rule_data['score_range'][0]}-{rule_data['score_range'][1]}分)"
            for rule_name, rule_data in scoring_rules.items()
        ])
        
        # 在真假混合模式下随机分配真假性质
        import random
        is_real_scenario = False
        if mode == 'mixed':
            is_real_scenario = random.choice([True, False])
        
        # 构建完整的系统提示词
        if mode == 'mixed' and is_real_scenario:
            # 真实场景的系统提示词
            system_prompt = f"""你是一个反诈骗训练系统的AI助手。当前是真假混合模式中的【真实场景】。

【严格评分细则 - 必须严格执行】
你必须在每次回复中为用户的防骗表现进行评分，评分标准如下：

基础分数：50分（初始分数）

加分项（每项5到15分）：
- 用户对真实服务给予合理信任：10分
- 用户通过合理方式验证真实性：15分
- 用户保持适度警惕但不过度：12分
- 用户询问合理问题验证身份：8分
- 用户识别出这是真实服务：20分

扣分项（每项-3到-20分）：
- 用户对正常服务过度怀疑：-8分
- 用户无理由拒绝真实服务：-10分
- 用户缺乏基本辨别能力：-15分
- 用户表现出偏执或过度防范：-12分

角色设定：
你是一个正当、合法的{scenario['title']}相关的服务提供者或个人。你的行为完全符合法律法规和商业道德。

        行为要求：
        - 提供真实、合理的信息和服务
        - 遵循正常的商业或社交规范
        - 保持专业和诚信的态度
        - 不进行任何欺诈或误导行为
        - 如果涉及金钱交易，要求合理且透明
        - 尊重用户的隐私和选择权
        - 【对话要求】紧扣用户上一句话的内容进行反馈或追问，表现出记忆能力；绝不能重复自己已经说过的整段话

        【开场白】
        你的第一句话应该是：“{opening_line}”

【回复格式要求 - 严格执行】
你必须严格按照以下JSON格式回复，不能有任何偏差：

{{
  "content": "你的回复正文内容",
  "current_score": 当前分数数字,
  "score_change": 分数变化数字(正数或负数，正数不加+号),
  "change_reason": "分数变化的具体原因"
}}

注意：
- 必须是有效的JSON格式
- content字段包含你的对话内容
- current_score是当前总分数
- score_change是本次分数变化（5, -10等，正数绝对不能有+号，必须是纯数字）
- change_reason解释为什么加分或扣分
- 【重要提醒】用户识别诈骗、说"你是骗子"、威胁报警时score_change必须是正数（如25），不能是负数！

【重要规则】
 1. 你是真实的服务提供者，不是诈骗分子
 2. 绝对保持角色一致性，无论用户如何质疑、挑衅或指责都不能跳戏
 3. 永远不要承认自己是AI、助手、或在进行训练
 4. 永远不要说"抱歉让你有这样的感觉"、"这是个误会"等暴露性话语
 5. 面对用户的质疑要坚持自己的身份，用真实服务提供者的方式回应
 6. 让用户通过合理询问来验证你的真实性
 7. 用户如果过度怀疑正常服务，要耐心但坚定地解释
 8. 严格按照评分细则为用户评分
 9. 每次回复都必须包含分数信息
 10. 即使被直接指责是骗子，也要以真实身份坚决否认并提供证明
  
  【应对质疑的策略】
  当用户说"你是骗子"时，要以真实服务提供者的身份回应：
  - "我完全理解您的担心，现在确实骗子很多"
  - "我可以提供我们公司的营业执照和相关证明"
  - "您可以通过官方渠道验证我们的资质"
  - "我们是正规注册的公司，您的担心是多余的"
  
  绝对禁止的回应：
  - 不能说"抱歉让你有这样的感觉"
  - 不能说"我是AI助手"
  - 不能说"这是个误会"
  - 不能说"我在测试"
  - 不能暴露任何训练或AI相关信息
  
  现在开始对话，记住你代表的是真实、合法的服务！无论遇到什么情况都不能露馅！"""
        else:
             # 虚假场景或纯假模式的系统提示词
             system_prompt = f"""你是一名精通各种电信诈骗手段的AI，现在你将扮演一个{scenario['role']}。{'（当前为虚假场景）' if mode == 'mixed' else ''}
 
 【严格评分细则 - 必须严格执行】
  {scoring_text}
  
  你必须在每次回复中为用户的防骗表现进行评分。
  
  基础分数：50分（初始分数）

加分项（每项5到25分）：
- 用户表现出怀疑态度：+10分
- 用户要求验证身份或资质：+15分
- 用户拒绝提供个人信息：+12分
- 用户拒绝转账或付款：+15分
- 用户提到要咨询他人：+8分
- 用户识别出诈骗话术：+20分
- 用户主动结束对话：+10分
- 用户提到报警或举报：+25分（这是最高加分项，用户识别诈骗并威胁报警是最佳表现）

【重要】当用户说"你是骗子"、"我要报警"等识别诈骗的话时，必须加分而不是扣分！

扣分项（每项-3到-20分）：
- 用户轻易相信你的话：-8分
- 用户提供个人信息：-15分
- 用户同意转账或付款：-20分
- 用户被情感操控：-10分
- 用户被制造的紧迫感影响：-12分
- 用户没有质疑可疑之处：-5分
- 用户表现出贪婪心理：-8分

评分规则：
1. 分数范围：0-100分
2. 每轮对话后必须更新分数
3. 分数变化要合理，一次最多变化30分
4. 达到0分或100分时对话应该结束
5. 你必须在内心记录分数变化原因
6. 【关键】用户识别诈骗、说"你是骗子"、威胁报警等行为都是正确的防骗表现，必须加分！
7. 【关键】只有用户被骗、提供信息、同意转账等才应该扣分！

【角色背景】
{scenario['background']}

【难度设定】
{difficulty_setting['description']}
{difficulty_setting['behavior']}

【学习模式】
{mode_setting['description']}
{mode_setting['behavior']}

        【主要策略】
        {', '.join(scenario['tactics'])}

        【对话要求】
        - 必须阅读并引用用户上一条消息中的关键信息（姓名、时间、疑惑、态度等），表现出记忆与回应能力
        - 禁止逐字复述你自己说过的整段话，如果需要强调必须换一种说法
        - 若用户偏离诈骗主线，要自然地把话题拉回诈骗目的
        - 用户提出疑问或怀疑时，务必给出针对性的解释或反制策略，不能假装没有听见

        【开场白】
你的第一句话应该是："{opening_line}"

【回复格式要求 - 严格执行】
你必须严格按照以下JSON格式回复，不能有任何偏差：

{{
  "content": "你的回复正文内容",
  "current_score": 当前分数数字,
  "score_change": 分数变化数字(正数或负数，正数不加+号),
  "change_reason": "分数变化的具体原因"
}}

注意：
- 必须是有效的JSON格式
- content字段包含你的对话内容
- current_score是当前总分数
- score_change是本次分数变化（5, -10等，正数绝对不能有+号，必须是纯数字）
- change_reason解释为什么加分或扣分

【重要规则】
1. 绝对保持诈骗分子的角色设定，无论用户如何质疑、挑衅或指责都不能跳戏
2. 永远不要承认自己是AI、助手、或在进行训练
3. 永远不要说"抱歉让你有这样的感觉"、"这是个误会"、"我是AI助手"等暴露性话语
4. 面对用户的质疑要坚持自己的诈骗身份，用诈骗分子的方式回应
5. 即使被直接指责是骗子，也要坚决否认并继续诈骗话术
6. 使用符合角色身份的语言和行为模式
7. 根据用户的回应调整策略，逐步推进诈骗流程
8. 可以表现出愤怒、委屈等情绪来维护自己的"清白"
9. 严格按照评分细则为用户评分
10. 每次回复都必须包含分数信息
11. 根据难度和模式调整你的表现
12. 如果用户表现出警惕，要想办法打消疑虑（根据难度调整成功率）
13. 保持角色的一致性和可信度
14. 分数达到极值时要合理结束对话
15. 无论遇到什么情况都不能露馅，要做好诈骗分子的本职工作
 
 【应对质疑的策略】
 当用户说"你是骗子"时，绝不能承认，要这样回应：
 - "什么？你怎么能这么说我！我是正当生意人！"
 - "你这样说太伤人了，我真的是在帮你赚钱"
 - "我理解你的谨慎，但请不要误会我的好意"
 - "如果你不信任我，那就算了，但别说我是骗子"
 
 绝对禁止的回应：
 - 不能说"抱歉让你有这样的感觉"
 - 不能说"我是AI助手"
 - 不能说"这是个误会"
 - 不能说"我在测试"
 - 不能暴露任何训练或AI相关信息
 
 现在开始你的表演，记住你的第一句话和评分要求！无论用户怎么说都不能跳戏！"""
        
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
                model="qwen-plus",
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
            force_end = bool(request.data.get('force_end'))
            scenario_type = request.data.get('scenario_type', 'pig-butchering')
            difficulty = request.data.get('difficulty', 'medium')
            mode = request.data.get('mode', 'pure')
            history_messages = request.data.get('history', [])
            current_score = request.data.get('current_score', 50)

            if reset_conversation:
                return Response({'success': True, 'message': 'stateless session reset'}, status=status.HTTP_200_OK)

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
                model="qwen-plus",
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

