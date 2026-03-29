import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonUsers = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      <div className="border-b border-base-300 p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto py-3">
        {skeletonUsers.map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="skeleton size-12 rounded-full" />
            <div className="hidden lg:block flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;