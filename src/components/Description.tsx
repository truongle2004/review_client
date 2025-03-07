import { FC } from 'react';

interface DescriptionProps {
  content: string;
  handleClose: () => void;
}

const Description: FC<DescriptionProps> = ({ content, handleClose }) => {
  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button 
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 text-sm font-medium"
              onClick={handleClose}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
            <h4 className="text-xl font-semibold text-gray-800">
              Description
            </h4>
            {/* Empty div for flex justification */}
            <div className="w-14"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <p
            className="text-gray-600 leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  );
};

export default Description;
