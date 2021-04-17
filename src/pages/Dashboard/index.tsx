import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';


interface FoodTypes {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface editingFood {
  food: FoodTypes;
  editModalOpen: boolean;
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodTypes[]>([]);
  const [editingFood, setEditingFood] = useState<editingFood>({} as editingFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: FoodTypes) => {
    setEditingFood({ food, editModalOpen });
    setEditModalOpen(true);
  };

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<FoodTypes[]>('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);


  async function handleAddFood(food: FoodTypes) {
    try {
      const response = await api.post<FoodTypes>('/foods', {
        ...food,
        available: true,
      });

     setFoods([ ...foods, response.data ]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodTypes) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.food.id}`,
        {
          ...editingFood,
          ...food
        },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods( foodsUpdated );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  };

  return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }

export default Dashboard;
