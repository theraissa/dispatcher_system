"""Modelos Pydantic reutilizáveis para respostas paginadas."""

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Estrutura padrão para respostas com paginação.
    """

    items: list[T]
    total: int
    page: int
    per_page: int
    pages: int

    @classmethod
    def from_pagination(cls, pagination, items: list[T]):
        """
        Cria uma resposta paginada a partir de um objeto de paginação do SQLAlchemy.
        """
        return cls(
            items=items,
            total=pagination.total,
            page=pagination.page,
            per_page=pagination.per_page,
            pages=pagination.pages,
        )
