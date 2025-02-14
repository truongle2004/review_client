import CommentComponent from './Comment';
import avatar from '../../public/my-notion-face-transparent.png';

// TODO: handle reply comments
const ListCommentComponent = () => {
  return (
    <CommentComponent
      imageUrl={avatar}
      username="truong dep trai"
      createAt={new Date()}
      content={` Is there something similar to helix's "gw" shortcut (Jump to a two-character label) in neovim? Be it a native shortcut or a plugin.

My use case:

I want to jump N words forward. I could use Nw, but that means I have to count how many words (N) there are until the word I want to jump to.

I could use NfL to jump to the Nth ocurrence of letter L, but that means I have to count how many letters L there are until the word I want to jump to. `}
    />
  );
};

export default ListCommentComponent;
