"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-item";
import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";




interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ListContainer = ({
  data,
  boardId,
}: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reorderd");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reorderd");
    },
    onError: (error) => {
      toast.error(error);
    },
  });


  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if(type === "list") {
      const items = reorder(
        orderData,
        source.index,
        destination.index,
      ).map((item, index) =>({ ...item, order: index }));

      setOrderData(items);
      executeUpdateListOrder({ items, boardId });
    }

    if(type === "card") {
      let newOrderedData = [...orderData];

      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destList = newOrderedData.find(list => list.id === destination.droppableId);

      if(!sourceList || !destList) {
        return;
      }

      // check if cards exist on the source list
      if(!sourceList.Cards) {
        sourceList.Cards = [];
      }

      // checkif cards exist on the destList
      if(!destList.Cards){
        destList.Cards = [];
      }

      // Moving the cards in the same list 
      if(source.droppableId === destination.droppableId){
        const reorderCards = reorder(
          sourceList.Cards,
          source.index,
          destination.index,
        );

        reorderCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.Cards = reorderCards;

        setOrderData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderCards,
        });
        // user moves cards to another list
      } else {
        // remove card from the source list
        const [movedCard] = sourceList.Cards.splice(source.index, 1);

        // Assign the new listId tothe moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.Cards.splice(destination.index, 0, movedCard);

        sourceList.Cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Update the order for each card in the destination List
        destList.Cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.Cards,
        });
      }
    }
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol className="flex gap-x-3 h-full"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {orderData.map((list, index) => {
              return (
                <ListItem 
                  key={list.id}
                  index={index}
                  data={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ListContainer