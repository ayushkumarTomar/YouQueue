import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react';
import ContextMenu from './ContextMenu';
import axios from 'axios'
interface VideoType {
    link: string;
    id: string;
    handleDelete:(id:string)=>void;
}
const VideoCard = ({ link, id , handleDelete }: VideoType) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [thumbnailUrl, setThumbnailUrl] = useState<string>("")
    const [videoTitle, setVideoTitle] = useState<string>("Loading")

    useEffect(() => {
        const iffy = async () => {
            
            try {
                const url = await axios(`https://www.youtube.com/oembed?url=${link}&format=json`);
                if (url && url.data !== "Unauthorized") {
                    setThumbnailUrl(url.data.thumbnail_url)
                    setVideoTitle(url.data.title.slice(0, 20))
                }
                else {
                    throw "error";
                }
            } catch (error) {
                console.log("TITLE NOT FOUND FOR :: " , link , "\n Setting thumbnail as :: " , `https://i.ytimg.com/vi/${extractVideoId(link)}/hqdefault.jpg`)
                setThumbnailUrl(`https://i.ytimg.com/vi/${extractVideoId(link)}/hqdefault.jpg`)
                
            }

        }
        iffy();
    }, [])
    
    
    return (
      <ContextMenu id={id} link={link} handleDelete = {handleDelete}>
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className='my-3 rounded-2xl'
            >
            <div
        className="relative w-64 h-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black opacity-90 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="text-lg hind-semibold">{videoTitle}</h3>
        </div>
      </div>

        </div>
        </ContextMenu>
    );
    
};

export default VideoCard;


function extractVideoId(url: string) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([^\s&]+)/);
    return match ? match[1] : null;
}