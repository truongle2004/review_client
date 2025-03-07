import { FC } from 'react';

interface DescriptionProps {
  content: string;
}

const Description: FC<DescriptionProps> = ({ content }) => {
  return (
    <section className="w-1/2 mx-auto">
      <h4 className="mb-0 text-center">Description</h4>
      <hr />
      <p
        className="lead link-no-decoration"
        style={{ whiteSpace: 'pre-wrap', padding: '10px 20px' }}
        dangerouslySetInnerHTML={{
          __html: content as string,
        }}
      ></p>
    </section>
  );
};

export default Description;
