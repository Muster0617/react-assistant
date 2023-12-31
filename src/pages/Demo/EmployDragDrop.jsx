import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

export default () => {
  const [items, setItems] = useState(getItems(6));

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newItems = reorder(items, result.source.index, result.destination.index);
    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
              display: 'flex',
              overflow: 'auto',
              padding: '16px 8px',
              ...provided.droppableProps,
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  (provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: 16,
                        margin: '0px 8px',
                        background: snapshot.isDragging ? 'lightgreen' : 'grey',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.content}
                    </div>
                  )
                }
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
