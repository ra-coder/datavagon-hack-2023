from typing import Generic, TypeVar

from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

_TModel = TypeVar("_TModel", bound=BaseModel)
_TPaginationField = TypeVar("_TPaginationField")


class InfinityScrollSchema(GenericModel, Generic[_TModel, _TPaginationField]):
    """Schema for endpoints which implement infinity scroll pagination.

    last_item_data is a data of last item in result list. For example, it can be just a timestamp or id field:
        last_item_data: datetime
    or complex model for ordering by multiple fields:
    last_item_data: {
        last_dt: datetime,
        last_filter_field_value: int
    }
    """
    result: list[_TModel] = Field(description="List of items")
    limit: int = Field(description="Transferred limit")
    last_item_data: _TPaginationField | None = Field(description="Transferred last item data")
