import { Color } from '../../typescript/types';

interface Props {
  text: string;
  color: Color;
  onClick?: () => void;
  className?: string;
}

export const Badge = (props: Props): JSX.Element => {
  const { text, color, onClick, className = '' } = props;

  return (
    <span 
      className={`badge bg-${color} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {text}
    </span>
  );
};
