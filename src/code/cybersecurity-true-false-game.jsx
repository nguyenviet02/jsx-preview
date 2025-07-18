const code = `
import React, { useState, useEffect, useRef } from 'react';

// Tailwind CSS classes for custom styles based on requirements
// NOTE: For 'IBM Plex Sans', you would typically extend your tailwind.config.js
// to include custom font families. For this standalone component, we'll use
// direct font-family in square brackets for IBM Plex Sans.
// For 'Fixed/Heading/Heading 03/Font family', we'll use 'font-sans' as a placeholder
// and note that it should be configured in tailwind.config.js for specific font.

// Custom color palette
const COLORS = {
  BACKGROUND_1: '#FFF2C2',
  BORDER_1: '#FFB800',
  BACKGROUND_2: '#ECF5FF',
  BORDER_2: '#027BE5',
  GAME_CONTENT_BG: '#F4F6FA',
  GAME_CONTENT_BORDER: '#B4B9CF',
  ALERT_BORDER_ICON: '#F4364B',
  ALERT_BACKGROUND: '#FFE9E9',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
};

// Tailwind classes for common styles
const commonBorderClasses = \`
  border-[3px] border-[\${COLORS.BLACK}] bg-[\${COLORS.WHITE}]
  shadow-[5px_8px_8px_rgba(0,0,0,0.05)]
\`;

const inGameBorderClasses = \`
  border-2 border-dashed border-[\${COLORS.GAME_CONTENT_BORDER}]
\`;

const headingClasses = \`
  font-['IBM_Plex_Sans'] text-[\${COLORS.BLACK}] text-[32px] leading-[44px] tracking-[-0.96px] text-center font-light
\`;

const subHeadingClasses = \`
  font-sans text-[\${COLORS.BLACK}] text-[24px] leading-[36px] tracking-[-0.72px] text-center font-light
  // NOTE: 'Fixed/Heading/Heading 03/Font family' needs to be configured in tailwind.config.js,
  // currently using font-sans as a placeholder.
\`;

const textContentClasses = \`
  font-['IBM_Plex_Sans'] text-[\${COLORS.BLACK}] text-[16px] leading-[26px] tracking-[-0.32px] font-normal
\`;

// Game Data (provided in the prompt, extended for more examples if needed)
const gameData = {
  "file_name": "cybersecurity-true-false-game",
  "type": "game",
  "title": "Kiểm tra kiến thức bảo mật thông tin",
  "topic": "Cybersecurity / Information Security",
  "description": "Một trò chơi mini nơi người dùng đánh giá các tuyên bố liên quan đến bảo vệ thông tin cá nhân và dữ liệu công ty, xác định xem chúng là đúng hay sai dựa trên các nguyên tắc an ninh mạng.",
  "game_type": "true_false",
  "components": [
    {
      "type": "title",
      "id": "game-title",
      "content": "Kiểm tra kiến thức bảo mật thông tin",
      "props": {}
    },
    {
      "type": "text",
      "id": "statement-display-area",
      "content": "Nội dung câu hỏi/tuyên bố sẽ hiển thị ở đây.",
      "props": {
        "style": "Font lớn, căn giữa, dễ đọc"
      }
    },
    {
      "type": "button",
      "id": "true-button",
      "content": "Đúng",
      "props": {
        "style": "Màu xanh lá cây, kích thước lớn"
      }
    },
    {
      "type": "button",
      "id": "false-button",
      "content": "Sai",
      "props": {
        "style": "Màu đỏ, kích thước lớn"
      }
    },
    {
      "type": "text",
      "id": "feedback-text",
      "content": "Phản hồi cho câu trả lời (ví dụ: 'Chính xác!', 'Sai rồi.').",
      "props": {
        "style": "Ẩn mặc định, hiển thị sau khi trả lời, màu sắc tương ứng (xanh/đỏ)"
      }
    },
    {
      "type": "button",
      "id": "next-button",
      "content": "Tiếp theo",
      "props": {
        "style": "Ẩn mặc định, hiển thị sau khi feedback được đưa ra"
      }
    }
  ],
  "items": [
    {
      "text": "Nên sử dụng cùng một mật khẩu cho tất cả các tài khoản trực tuyến để dễ nhớ.",
      "category": "False",
      "metadata": {
        "hint": "Mật khẩu duy nhất cho mỗi tài khoản là an toàn hơn.",
        "explanation": "Sử dụng mật khẩu duy nhất và phức tạp cho mỗi tài khoản giúp giảm thiểu rủi ro khi một tài khoản bị lộ, vì các tài khoản khác sẽ không bị ảnh hưởng."
      }
    },
    {
      "text": "Cần thường xuyên cập nhật phần mềm và hệ điều hành để vá lỗi bảo mật.",
      "category": "True",
      "metadata": {
        "hint": "Các bản cập nhật thường bao gồm các bản vá lỗi an ninh.",
        "explanation": "Các bản cập nhật phần mềm thường chứa các bản vá lỗi bảo mật quan trọng giúp bảo vệ thiết bị khỏi các mối đe dọa mới và các lỗ hổng đã được biết đến."
      }
    },
    {
      "text": "Chia sẻ quá nhiều thông tin cá nhân trên mạng xã hội là an toàn nếu bạn chỉ chia sẻ với bạn bè.",
      "category": "False",
      "metadata": {
        "hint": "Ngay cả bạn bè cũng có thể vô tình làm lộ thông tin.",
        "explanation": "Ngay cả khi chia sẻ với bạn bè, thông tin cá nhân vẫn có thể bị lợi dụng hoặc rò rỉ nếu tài khoản của bạn bè bị xâm nhập hoặc cài đặt quyền riêng tư không được quản lý chặt chẽ. Luôn hạn chế thông tin cá nhân được chia sẻ công khai."
      }
    },
    {
      "text": "Mở các tệp đính kèm từ email không rõ nguồn gốc là an toàn nếu phần mềm diệt virus của bạn đang chạy.",
      "category": "False",
      "metadata": {
        "hint": "Phần mềm diệt virus không phải lúc nào cũng phát hiện được mọi mối đe dọa mới.",
        "explanation": "Luôn cảnh giác với các tệp đính kèm từ email không rõ nguồn gốc. Mặc dù phần mềm diệt virus có thể giúp, nhiều phần mềm độc hại mới có thể vượt qua các biện pháp bảo vệ hiện có. Tốt nhất là không mở các tệp đáng ngờ."
      }
    },
    {
      "text": "Sử dụng mạng Wi-Fi công cộng không yêu cầu mật khẩu là an toàn để thực hiện các giao dịch ngân hàng trực tuyến.",
      "category": "False",
      "metadata": {
        "hint": "Mạng công cộng thường không được mã hóa và dễ bị nghe lén.",
        "explanation": "Mạng Wi-Fi công cộng thường không được mã hóa, khiến dữ liệu của bạn dễ bị các kẻ tấn công nghe lén. Tránh thực hiện các giao dịch nhạy cảm như ngân hàng trực tuyến hoặc mua sắm khi sử dụng Wi-Fi công cộng không an toàn."
      }
    }
  ],
  "interactions": [
    {
      "trigger": "Người dùng nhấp vào nút 'Đúng' hoặc 'Sai'",
      "response": "Hệ thống kiểm tra câu trả lời với 'category' của item hiện tại. Hiển thị 'feedback-text' tương ứng ('Chính xác!' hoặc 'Sai rồi.'). Vô hiệu hóa nút 'Đúng' và 'Sai'. Hiển thị nút 'Tiếp theo'."
    },
    {
      "trigger": "Người dùng nhấp vào nút 'Tiếp theo'",
      "response": "Hệ thống tải câu hỏi/tuyên bố tiếp theo từ danh sách 'items'. Ẩn 'feedback-text'. Kích hoạt lại nút 'Đúng' và 'Sai'. Ẩn nút 'Tiếp theo'."
    }
  ],
  "feedback": true
};

const CybersecurityTrueFalseGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const feedbackRef = useRef(null); // Ref for ARIA live region

  const currentQuestion = gameData.items[currentQuestionIndex];

  // Effect to focus on feedback for screen readers when it appears
  useEffect(() => {
    if (showFeedback && feedbackRef.current) {
      feedbackRef.current.focus();
    }
  }, [showFeedback]);

  const handleAnswer = (answer) => {
    if (isAnswered) return; // Prevent multiple answers if already answered

    const correct = currentQuestion.category === answer;
    setIsCorrect(correct);
    setFeedbackMessage(
      correct ? 'Chính xác!' : \`Sai rồi. \${currentQuestion.metadata.explanation}\`
    );
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    setShowFeedback(true);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < gameData.items.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setShowFeedback(false);
      setFeedbackMessage('');
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFeedback(false);
    setFeedbackMessage('');
    setIsCorrect(false);
    setIsAnswered(false);
    setGameOver(false);
  };

  return (
    <div
      className={\`
        min-h-screen flex flex-col items-center justify-center p-4
        bg-[\${COLORS.BACKGROUND_1}]
        font-['IBM_Plex_Sans']
      \`}
    >
      <img
        src="https://i.ibb.co/qLgM2cfL/image.png"
        alt="Logo"
        className="mb-6 w-24 h-auto"
      />

      <main
        className={\`
          w-full max-w-2xl p-6 rounded-lg flex flex-col items-center
          \${commonBorderClasses}
        \`}
        role="region"
        aria-label={gameData.title}
      >
        <h1 className={\`\${headingClasses} mb-4\`}>
          {gameData.title}
        </h1>

        <p className={\`\${textContentClasses} mb-8 text-center\`}>
          {gameData.description}
        </p>

        {gameOver ? (
          <div className="text-center">
            <h2 className={\`\${subHeadingClasses} mb-4\`}>Trò chơi kết thúc!</h2>
            <p className={\`\${textContentClasses} mb-6\`}>
              Bạn đã đạt được {score} trên {gameData.items.length} điểm.
            </p>
            <button
              onClick={handleRestart}
              className={\`
                px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200
                bg-[\${COLORS.BORDER_1}] text-[\${COLORS.BLACK}] hover:bg-[\${COLORS.BORDER_2}] hover:text-[\${COLORS.WHITE}]
                focus:outline-none focus:ring-4 focus:ring-[\${COLORS.BORDER_1}] focus:ring-opacity-50
              \`}
              aria-label="Chơi lại trò chơi"
            >
              Chơi lại
            </button>
          </div>
        ) : (
          <>
            <section
              className={\`
                w-full p-6 text-center mb-6 rounded-lg
                bg-[\${COLORS.GAME_CONTENT_BG}]
                \${inGameBorderClasses}
              \`}
              aria-live="polite"
              aria-atomic="true"
              aria-label={\`Câu hỏi \${currentQuestionIndex + 1} trên \${gameData.items.length}. Tuyên bố: \${currentQuestion.text}\`}
            >
              <p
                className={\`
                  text-[22px] leading-[32px] tracking-[-0.5px] font-medium
                  text-[\${COLORS.BLACK}]
                \`}
                id="statement-display-area"
              >
                {currentQuestion.text}
              </p>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full justify-center">
              <button
                onClick={() => handleAnswer('True')}
                disabled={isAnswered}
                className={\`
                  flex-1 px-8 py-4 rounded-lg text-xl font-bold transition-colors duration-200
                  \${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}
                  bg-green-600 text-white hover:bg-green-700
                  focus:outline-none focus:ring-4 focus:ring-green-300
                \`}
                aria-disabled={isAnswered}
                aria-label="Trả lời là Đúng"
                id="true-button"
              >
                Đúng
              </button>
              <button
                onClick={() => handleAnswer('False')}
                disabled={isAnswered}
                className={\`
                  flex-1 px-8 py-4 rounded-lg text-xl font-bold transition-colors duration-200
                  \${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}
                  bg-red-600 text-white hover:bg-red-700
                  focus:outline-none focus:ring-4 focus:ring-red-300
                \`}
                aria-disabled={isAnswered}
                aria-label="Trả lời là Sai"
                id="false-button"
              >
                Sai
              </button>
            </div>

            {showFeedback && (
              <div
                className={\`
                  w-full p-4 rounded-lg text-center mb-6
                  \${isCorrect ? \`bg-green-100 border-2 border-green-500 text-green-700\` : \`bg-[\${COLORS.ALERT_BACKGROUND}] border-2 border-[\${COLORS.ALERT_BORDER_ICON}] text-[\${COLORS.ALERT_BORDER_ICON}]\`}
                \`}
                role="status"
                aria-live="assertive"
                ref={feedbackRef}
                tabIndex={-1} // Make it focusable for screen readers
                id="feedback-text"
              >
                <p className={\`\${textContentClasses} !text-inherit\`}>
                  {feedbackMessage}
                </p>
              </div>
            )}

            {isAnswered && (
              <button
                onClick={handleNext}
                className={\`
                  px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200
                  bg-[\${COLORS.BORDER_2}] text-[\${COLORS.WHITE}] hover:bg-[\${COLORS.BORDER_1}] hover:text-[\${COLORS.BLACK}]
                  focus:outline-none focus:ring-4 focus:ring-[\${COLORS.BORDER_2}] focus:ring-opacity-50
                \`}
                aria-label="Chuyển đến câu hỏi tiếp theo"
                id="next-button"
              >
                Tiếp theo
              </button>
            )}
          </>
        )}
      </main>

      <p className={\`\${textContentClasses} mt-6 text-center\`}>
        Điểm số: {score} / {gameData.items.length}
      </p>
    </div>
  );
};

	export default CybersecurityTrueFalseGame;
`;

export default code;