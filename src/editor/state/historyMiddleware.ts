// Simple utility to compare two arrays of blocks for equality
export const areBlocksEqual = (blocks1: any[], blocks2: any[]): boolean => {
  if (blocks1.length !== blocks2.length) return false;
  
  // Compare by id and structure only (components are not compared)
  return blocks1.every((block, index) => {
    const other = blocks2[index];
    return block.id === other.id && 
           block.type === other.type && 
           block.componentName === other.componentName;
  });
};
