export interface Category {
  id: number
  name: string | null
}

export interface AddCategoryDto {
  name: string
}

export interface UpdateCategoryDto {
  id: number
  name: string
}
