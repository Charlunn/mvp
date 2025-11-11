"""Seed the quiz question bank with curated multi-level items."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple

BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mvp_backend.settings")

import django  # noqa: E402

django.setup()

from quiz.models import Question  # noqa: E402


QuestionPayload = Dict[str, str]


QUESTION_BANK: List[QuestionPayload] = [
    {
        "level": "beginner",
        "text": "家人突然通过陌生号码发来“验证码”截图让你转钱，最稳妥的做法是？",
        "option_a": "立即照做，防止耽误",
        "option_b": "转发验证码给对方确认",
        "option_c": "先用常用方式回拨核实身份",
        "option_d": "截图分享到朋友圈询问",
        "correct_answer": "C",
    },
    {
        "level": "beginner",
        "text": "遇到“客服”称订单异常并发送退款链接，第一步应该？",
        "option_a": "点击链接尽快处理",
        "option_b": "截图保存聊天记录",
        "option_c": "通过官方平台自查订单状态",
        "option_d": "把链接转给朋友代点",
        "correct_answer": "C",
    },
    {
        "level": "beginner",
        "text": "陌生短信告知“医保停用需激活”，正确判断是？",
        "option_a": "医保系统升级，跟进即可",
        "option_b": "属于高频诈骗诱导点击",
        "option_c": "只要不输入身份证就安全",
        "option_d": "转发给家人提醒他们操作",
        "correct_answer": "B",
    },
    {
        "level": "intermediate",
        "text": "自称“公安”电话称账号涉案并要求视频连线核查资产，安全对策？",
        "option_a": "全程配合避免被列管控",
        "option_b": "要求对方出示电子警官证即可",
        "option_c": "挂断电话并主动联系属地警方核实",
        "option_d": "提供部分银行卡信息以示清白",
        "correct_answer": "C",
    },
    {
        "level": "intermediate",
        "text": "你在社交平台收到“刷单返利”邀请，对资金最安全的处理方式？",
        "option_a": "投入小金额试水",
        "option_b": "索要营业执照判断真假",
        "option_c": "拒绝参与并截图举报平台",
        "option_d": "让朋友一起参与分散风险",
        "correct_answer": "C",
    },
    {
        "level": "intermediate",
        "text": "同事发来紧急采购合同，付款账号与以往不同，此时应？",
        "option_a": "相信同事判断尽快打款",
        "option_b": "通过公司内线或当面复核需求",
        "option_c": "让供应商提供收款二维码以便确认",
        "option_d": "拆分多笔汇款降低损失",
        "correct_answer": "B",
    },
    {
        "level": "advanced",
        "text": "供应链邮件中附件被替换为带木马的“对账单”，企业侧第一响应？",
        "option_a": "立即打开确认内容",
        "option_b": "转发给财务部核对细节",
        "option_c": "在隔离环境中验证文件指纹并通知SOC",
        "option_d": "删除邮件即可避免风险",
        "correct_answer": "C",
    },
    {
        "level": "advanced",
        "text": "遭遇AI换脸视频索要担保金，哪项联合验证链最可靠？",
        "option_a": "仅看对方长相是否熟悉",
        "option_b": "要求实时完成约定暗号动作并回拨官方号码",
        "option_c": "改用文字聊天确认语气",
        "option_d": "直接质问是否诈骗",
        "correct_answer": "B",
    },
    {
        "level": "advanced",
        "text": "内部聊天工具出现钓鱼链接并有人已点击，正确的后续流程为？",
        "option_a": "忽略，等待IT部门公告",
        "option_b": "私下提醒熟悉的同事勿点",
        "option_c": "立即上报安全团队并配合取证、隔离终端",
        "option_d": "把链接复制到浏览器验证真假",
        "correct_answer": "C",
    },
]


def seed_questions() -> Tuple[int, int]:
    created = 0
    updated = 0

    for payload in QUESTION_BANK:
        question, was_created = Question.objects.update_or_create(
            text=payload["text"],
            defaults=payload,
        )
        if was_created:
            created += 1
        else:
            updated += 1
    return created, updated


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Seed the quiz_question table with curated multi-difficulty content.",
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Delete all existing quiz questions before inserting the seed data.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.reset:
        deleted, _ = Question.objects.all().delete()
        print(f"[quiz-seed] Removed {deleted} existing questions")

    created, updated = seed_questions()
    total = Question.objects.count()

    print(
        f"[quiz-seed] Created {created}, updated {updated}, "
        f"{total} questions now available.",
    )


if __name__ == "__main__":
    main()
