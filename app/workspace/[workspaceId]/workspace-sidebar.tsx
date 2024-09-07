import { AlertTriangle, Loader } from "lucide-react";

import {
  useCurrentMember,
  useGetWorkspace,
  useWorkspaceId,
} from "@/hooks";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: loadingMember } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId });

  if (loadingWorkspace || loadingMember) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">
          Workspace not found
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        isAdmin={member.role === 'admin'}
        workspace={workspace}
      />
    </div>
  )
};