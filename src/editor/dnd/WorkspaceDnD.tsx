import dynamic from "next/dynamic";

const WorkspaceDnD = dynamic(() => import("./WorkspaceDnDInternal"), {
  ssr: false,
});

export default WorkspaceDnD;
