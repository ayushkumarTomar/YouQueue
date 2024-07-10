import './App.css';
import React, { useEffect, useRef, useState } from 'react';
interface YtVideos {
  id: string,
  link: string
}


import VideoCard from './component/VideoCard';
import VideoCardSkeleton from './component/VideoCardSkeleton';


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
        {videoList.map((item) => (
              <VideoCard key={item.id} link={item.link} id={item.id} handleDelete={handleDelete}/>
            ))}
     
      </div>
    </>
  );
};

export default App;
