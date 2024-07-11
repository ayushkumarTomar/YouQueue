import './App.css';
import React, { useEffect, useRef, useState } from 'react';
interface YtVideos {
  id: string,
  link: string
}


import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import VideoCard from './component/VideoCard';
import VideoCardSkeleton from './component/VideoCardSkeleton';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';


const App: React.FC = () => {


  const [videoList, setVideoList] = useState<YtVideos[]>([])
  const hasPageRendered = useRef(false)
  const [loading, setLoading] = useState(true)





  useEffect(() => {
    chrome.runtime.sendMessage({ message: "getQueue" }, (response) => {
      if (response) {
        setVideoList(response)
        hasPageRendered.current = true
      }
    })
    setLoading(false)

    return (() => {
    })

  }, [])

  useEffect(() => {
    if (hasPageRendered.current) {
      chrome.runtime.sendMessage({ message: "updateQueue", queue: videoList })
    }
  }, [videoList])

  const handelDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setVideoList((items) => {
        const oldIndex = videoList.findIndex(video => video.id === active.id)
        const newIndex = videoList.findIndex(video => video.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const deleteQueue = ()=>{
    setVideoList([])
  }

  const handleDelete = (idToDelete:string)=>{
    setVideoList(prev=>prev.filter(video => video.id !== idToDelete))

  }


  if (loading) {
    return <VideoCardSkeleton />
  }
  return (
    <>
      <div className='bg-zinc-800  w-64'>
          <div className="flex justify-center">
              <h1 className="bangers-regular text-xl mt-2 self-center flex-grow">Youtube Queue</h1>
              <span className="self-center material-symbols-outlined cursor-pointer hover:bg-red-600" onClick={deleteQueue}>delete</span>
          </div>


        {videoList.length < 1 && <div className='text-white font-lg comic-neue-bold my-6 text-center'>No Videos in Queue</div>}
        <DndContext onDragEnd={handelDragEnd}
          collisionDetection={closestCorners}
          modifiers={[restrictToWindowEdges]}>

          <SortableContext items={videoList} strategy={verticalListSortingStrategy} >
            {videoList.map((item) => (
              <VideoCard key={item.id} link={item.link} id={item.id} handleDelete={handleDelete}/>
            ))}
          </SortableContext>
        </DndContext>

      </div>
    </>
  );
};

export default App;
