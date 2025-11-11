from __future__ import annotations

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


def _env(key: str, fallback: str) -> str:
    return os.environ.get(key, fallback)


class Command(BaseCommand):
    help = "Create the default Charlun admin account if it does not exist."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--username",
            default=_env("DEFAULT_ADMIN_USERNAME", "Charlun"),
            help="Administrator username to create.",
        )
        parser.add_argument(
            "--password",
            default=_env("DEFAULT_ADMIN_PASSWORD", "xyx20040611"),
            help="Administrator password.",
        )
        parser.add_argument(
            "--email",
            default=_env("DEFAULT_ADMIN_EMAIL", "charlunn@icloud.com"),
            help="Administrator email address.",
        )
        parser.add_argument(
            "--nickname",
            default=_env("DEFAULT_ADMIN_NICKNAME", "Charlun"),
            help="Friendly display name.",
        )
        parser.add_argument(
            "--phone",
            default=_env("DEFAULT_ADMIN_PHONE", "17309714040"),
            help="Phone number for the admin account.",
        )

    def handle(self, *args, **options) -> None:
        username: str = options["username"]
        password: str = options["password"]
        email: str = options["email"]
        nickname: str = options["nickname"]
        phone: str = options["phone"]

        UserModel = get_user_model()
        existing = UserModel.objects.filter(username=username).first()
        if existing:
            self.stdout.write(
                self.style.SUCCESS(f"[admin-seed] '{username}' already exists; skipping creation.")
            )
            return

        if phone and UserModel.objects.filter(phone_number=phone).exists():
            raise CommandError(
                f"[admin-seed] phone number {phone} is already in use; "
                "please remove the conflicting user or change DEFAULT_ADMIN_PHONE."
            )

        user = UserModel.objects.create_superuser(
            username=username,
            password=password,
            email=email,
        )
        user.nickname = nickname
        user.phone_number = phone or None
        user.platform_username = username
        user.user_type = "admin"
        user.save(update_fields=["nickname", "phone_number", "platform_username", "user_type"])

        self.stdout.write(self.style.SUCCESS(f"[admin-seed] Created admin user '{username}'"))
