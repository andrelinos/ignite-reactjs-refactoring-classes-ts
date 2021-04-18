export interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export interface ModalEditFoodProps {
  food: FoodProps;
  editingFood: FoodProps
  handleEditFood: (data: FoodProps) => void;
  handleDelete: (id: number) => void;
  setIsOpen: () => void
}
