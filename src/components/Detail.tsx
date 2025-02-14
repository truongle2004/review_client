import { faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatar from '../../public/my-notion-face-transparent.png';
import Avatar from './Avatar';
import ListCommentComponent from './ListComment';
import TextEditor from './TextEditor';
import { useState } from 'react';

const DetailComponent = () => {
  const [comment, setComment] = useState('');

  const handleCancelComment = () => setComment('');
  const handleSubmitComment = () => {
    // TODO: do something
  };

  return (
    <article className="card bg-base-100 w-1/2 mx-auto mb-10">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-4">
            <Avatar src={avatar} username="Truong Dep Trai" />
          </div>
          <p className="text-sm text-gray-500">2 days ago</p>
        </div>

        <h2 className="card-title">Card title!</h2>
        <p>
          I've been trying to understand how state management works in a production-level React app,
          but every tutorial or article I find just covers the basics—either using React hooks or a
          popular state management library (like Redux/Zustand) with simple examples like a counter
          app. But what about real-world concerns like: Managing API fetches efficiently Syncing
          state with the server Deciding when to fetch new data Handling cache invalidation Keeping
          UI state in sync with real-time updates My Context: I'm building an event management web
          app with basic CRUD operations (creating, deleting, editing events). Each event also has a
          list of live attendees, so I’m using Socket.IO for real-time updates. I initially used
          Zustand for state management, and while it works fine for managing local state, things got
          messy when handling server sync: I felt like I was doing a lot of hacky workarounds.
          Navigating between pages triggered unnecessary re-fetching of data. I had no structured
          way to manage server updates efficiently. What I'm Looking For: I'm not looking for
          another counter app or to-do list tutorial. I want resources (codebases, articles,
          tutorials, GitHub repos—anything) that show how to handle state in a real-world React app
          with: Frequent API fetches Real-time data syncing Cache management & invalidation Best
          practices for structured state handling How do you guys handle state in your production
          apps? Any recommendations? Edit (After Reading Comments & Feedback) Huge thanks to
          everyone for the quick and insightful responses! Your suggestions have given me a much
          clearer direction. I'll be learning React Query (TanStack Query) to properly manage server
          state and revisiting how I structure global vs. local state. Your insights on where to
          store different types of state were super helpful. One More Ask: If anyone knows of a FOSS
          React web app (preferably one with user authentication, API fetching, and structured state
          management), I'd love to check out the code and learn how it's done in real-world
          applications. Any recommendations?
        </p>
        <div className="card-actions justify-start items-center">
          {/*RATING*/}
          <div className="rating">
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              defaultChecked
            />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
          </div>
          {/* BUTTONS ACTION*/}
          <button className="btn">
            <FontAwesomeIcon icon={faComment} />
            <p>6</p>
          </button>
          <button className="btn">
            <FontAwesomeIcon icon={faShare} />
            <p>share</p>
          </button>
        </div>
      </div>

      {/*COMMENT SECTION*/}
      <TextEditor
        field="comment"
        labelText="write comment"
        setValue={setComment}
        defaultValue={comment}
      />

      <div className="flex gap-4 justify-end">
        <button className="btn btn-secondary  max-w-24" onClick={handleCancelComment}>
          cancel
        </button>
        <button className="btn btn-primary  max-w-24" onClick={handleSubmitComment}>
          comment
        </button>
      </div>

      {/*LIST COMMENTS*/}
      <ListCommentComponent />
    </article>
  );
};

export default DetailComponent;
