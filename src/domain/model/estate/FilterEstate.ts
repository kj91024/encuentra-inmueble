export interface FilterEstate {
    id_departament?: number;
    id_province?: number;
    id_district?: number;

    id_operation?: number;
    id_property?: number;

    id_currency?: number;
    min_price?: number;
    max_price?: number;

    min_floors?: number;
    max_floors?: number;

    min_bathrooms?: number;
    max_bathrooms?: number;

    min_rooms?: number;
    max_rooms?: number;

    min_area?: number;
    max_area?: number;

    order: number;
    page: number;
    size: number;
}