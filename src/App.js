import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid/v4';

const itemsFromBackend =[
  { id: uuid(),content: 'First Task' },
  { id: uuid(),content: 'Second Task' },
  { id: uuid(),content: 'Third Task' },
  { id: uuid(),content: 'Fourth Task' },
  { id: uuid(),content: 'Fifth Task' },
  { id: uuid(),content: 'Sixth Task' },
  { id: uuid(),content: 'Seventh Task' },
  { id: uuid(),content: 'Eighth Task' },
  { id: uuid(),content: 'Ninth Task' },
  { id: uuid(),content: 'Tenth Task' },
];

const columnsFromBackend =
  {
    [uuid()]:{
      name: 'Requested',
      items: itemsFromBackend,
    },
    [uuid()]:{
      name: 'To do',
      items: [],
    },
    [uuid()]:{
      name: 'In Progress',
      items: [],
    },
    [uuid()]:{
      name: 'Done',
      items: [],
    },
  };

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const {source, destination} = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }      
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...column,
        items:copiedItems
      }
    })
  };
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
    <h1>KANBAN-BOARD</h1>
      <DragDropContext onDragEnd={ result => onDragEnd(result, columns, setColumns) }>
      {/* result => console.log(result) */}
        {Object.entries(columns).map(([id, column])=> {
          return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{column.name}</h2>
              <div style={{margin:8}}>
                <Droppable droppableId={ id } key={ id }>
                  {(provided, snapshot) =>{
                    return(
                      <div {...provided.droppableProps} 
                            ref={provided.innerRef} 
                              style={{background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey', 
                                padding: 4, 
                                  width: 250, 
                                    minHeight: 500
                              }}>
                                {column.items.map((item, index) => {
                                  return (
                                    <Draggable key={item.id} draggableId={item.id} index={index} >
                                      {(provided, snapshot) =>{
                                        return (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              userSelect: 'none',
                                              padding: 16,
                                              margin: '0 0 8px 0',
                                              minHeight: '10px',
                                              backgroundColor: snapshot.isDragging ? '#B491C8' : '#BCA0DC',
                                              color: 'white',
                                              ...provided.draggableProps.style
                                            }}
                                            >
                                              {item.content}
                                          </div>
                                        )
                                      }}
                                    </Draggable>
                                  )
                                })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </div>
            </div> 
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
