type SideBarEdit = {
  title: string;
  slug: string;
};

export default function RightSideBar({
  slug,
  title,
}: SideBarEdit) {
  return <div className='flex flex-col gap-3 pl-2'></div>;
}
