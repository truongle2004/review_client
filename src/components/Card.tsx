import { faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatar from '../../public/my-notion-face-transparent.png';
import Avatar from './Avatar';

const Card = () => {
  return (
    <>
      <div className="card bg-base-100 shadow-xl hover:glass hover:shadow-lg transition-opacity duration-300">
        <div className="card-body">
          <Avatar src={avatar} username="truong dep trai" />
          <h2 className="card-title text-white">Card title!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-start">
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
      </div>

      <div className="divider w-1/2 mx-auto"></div>
    </>
  );
};

export default Card;
