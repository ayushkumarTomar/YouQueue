import { useEffect, useRef } from "react";
import {
  Menu,
  Item,
  useContextMenu,
  ItemParams,
  ItemProps, 
  contextMenu

} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";



interface contextMenuProps{
    link:string;
    id:string;
    handleDelete:(id:string)=>void;
    children:React.ReactNode;
}

interface ExtendedItemProps extends ItemProps {
  link: string;
  id: string;
}

function ContextMenu({link , id , handleDelete , children}:contextMenuProps) {
  const { show } = useContextMenu({
      id: id ,
      props:{link , id}
  });

  const contextMenuRef = useRef<HTMLDivElement>(null)
  const handleRemove = (e:ItemParams<ItemProps>)=>{
      handleDelete(id)
  }
  const copyLink = (e:ItemParams<ExtendedItemProps>)=>{
    if(e.props?.link) navigator.clipboard.writeText(e.props?.link);

}

  function displayMenu(e:React.MouseEvent){
    show({
      event: e,
    });
  }

  useEffect(() => {
    const handleClickOutside = () => {
      contextMenu.hideAll();
    };

    const contextMenuElement = contextMenuRef.current;
    if (contextMenuElement) {
      contextMenuElement.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (contextMenuElement) {
        contextMenuElement.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, []);
  
return (
  <div ref={contextMenuRef} onContextMenu={displayMenu} >
    {children}
    <Menu id={id} animation="slide" theme="dark">
<Item onClick={handleRemove}>Remove Video</Item>
<Item onClick={copyLink}>Copy Link</Item>
</Menu>
  </div>)
}

export default ContextMenu
