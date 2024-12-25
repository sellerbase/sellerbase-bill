declare module '@hello-pangea/dnd' {
  import { ReactNode } from 'react';

  export type DraggableLocation = {
    droppableId: string;
    index: number;
  };

  export type DropResult = {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    destination: DraggableLocation | null;
    reason: 'DROP' | 'CANCEL';
  };

  export type DraggableProvided = {
    draggableProps: {
      style?: React.CSSProperties;
      [key: string]: any;
    };
    dragHandleProps: {
      [key: string]: any;
    } | null;
    innerRef: (element: HTMLElement | null) => void;
  };

  export type DroppableProvided = {
    droppableProps: {
      [key: string]: any;
    };
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: ReactNode;
  };

  export type DragDropContextProps = {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (update: DragUpdate) => void;
    children: ReactNode;
  };

  export type DroppableProps = {
    droppableId: string;
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'vertical' | 'horizontal';
    ignoreContainerClipping?: boolean;
    renderClone?: any;
    getContainerForClone?: () => HTMLElement;
    children: (provided: DroppableProvided) => ReactNode;
  };

  export type DraggableProps = {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    children: (provided: DraggableProvided) => ReactNode;
  };

  export const DragDropContext: React.FC<DragDropContextProps>;
  export const Droppable: React.FC<DroppableProps>;
  export const Draggable: React.FC<DraggableProps>;
} 