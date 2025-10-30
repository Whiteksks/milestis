import {useDraggable} from '@dnd-kit/react';

export function Draggable() {
  const {ref} = useDraggable({
    id: 'draggable',
  });

  return (
    <div ref={ref} className='bg-primary p-4 w-fit rounded-2xl h-fit'>
      Draggable
    </div>
  );
}