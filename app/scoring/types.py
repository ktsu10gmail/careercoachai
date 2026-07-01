from dataclasses import dataclass


@dataclass(frozen=True)
class Requirement:
    text: str
    category: str
    aliases: tuple[str, ...]
