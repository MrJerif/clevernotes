const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:bg-[#1F1F1F] h-full flex">
      <main className='flex-1 h-full overflow-y-auto'>
        {children}
      </main>
    </div>
  )
}

export default PublicLayout;