
function VideoCardSkeleton() {
    return (
        <div className='bg-zinc-800  w-64 '>
        <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 w-ful"></div>
            <div className="h-20 ms-2 bg-gray-300 dark:bg-gray-600 w-full"></div>
            <div className="h-20 ms-2 bg-gray-300 dark:bg-gray-600 w-full"></div>

            <span className="sr-only">Loading...</span>
        </div>
        </div >
    )
}

export default VideoCardSkeleton