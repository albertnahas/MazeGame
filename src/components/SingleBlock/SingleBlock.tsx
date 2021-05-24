import React from 'react';
import Block from '../../models/Block';
import styles from './SingleBlock.module.scss';
import styled, { keyframes } from "styled-components";
import { BOTTOM, LEFT, RIGHT, TOP } from '../../constants';

type Props = {
  block: Block,
  active: boolean,
  size: number
}

// const getBorder = (direction: number, block: Block) => {
//   // return !block.sides[direction].open ? '2px solid black' : 'none';
//   let shadow: string = "";
//   if (!block.sides[TOP].open) {
//     shadow += ' 0 -1px 0 0 black';
//   }
//   if (!block.sides[LEFT].open) {
//     shadow.length > 0 && (shadow += ',');
//     shadow += ' -1px 0 0 0 black';
//   }
//   if (!block.sides[BOTTOM].open) {
//     shadow.length > 0 && (shadow += ',');
//     shadow += ' 0 1px 0 0 black';
//   }
//   if (!block.sides[RIGHT].open) {
//     shadow.length > 0 && (shadow += ',');
//     shadow += ' 1px 0 0 0 black';
//   }
//   return shadow;
// }
const getBackground = (block: Block, colored: boolean, size: number) => {
  if (block.exit > -1)
    return `repeating-linear-gradient( 45deg,transparent,transparent ${size / 4}px,#e6c5ff ${size / 4}px,#e6c5ff ${size / 2.8}px)`;
  if (colored) {
    return `repeating-linear-gradient(45deg,transparent,transparent ${size / 4}px,rgb(0 255 181 / 30%) ${size / 4}px,rgb(0 255 181 / 30%) ${size / 2.8}px)`;
  }
  return 'transparent';
}

const animation = keyframes`
 100% { background-position: 0px; }
`

// border-top: ${(props: any) => getBorder(TOP, props.block)};
// border-left: ${(props: any) => getBorder(LEFT, props.block)};
// border-bottom: ${(props: any) => getBorder(BOTTOM, props.block)};
// border-right: ${(props: any) => getBorder(RIGHT, props.block)};
// box-shadow: ${(props: any) => getBorder(RIGHT, props.block)};
const StyledBlock = styled.span<{ block: Block, colored: boolean, size: number }>`
width: ${(props: any) => `${props.size}px`};
height: ${(props: any) => `${props.size}px`};
display:inline-block;
box-sizing:border-box;
text-align:center;
line-height:1.5;
font-size:14px;
vertical-align:bottom;
transition:all 100ms;
position:relative;
&:after {
  content: "";
  background:${(props: any) => getBackground(props.block, props.colored, props.size)};
  width:calc(100%);
  height:calc(100%);
  position:absolute;
  top:0px;
  left:0px;
  z-index:-1;
  border-radius:2px;
  
  animation: ${animation} 1s linear infinite;
background-size: 200% 200%;
}
`;

const SingleBlock: React.FC<Props> = (props: Props) => {

  const { block, active, size } = props;
  // props.block.sides[TOP].open || props.block.sides[RIGHT].open ;

  return (
    <StyledBlock size={size} colored={active} block={block} >
      {!block.sides[TOP].open && <span className={styles.borderTop}></span>}
      {!block.sides[LEFT].open && <span className={styles.borderLeft}></span>}
      {!block.sides[BOTTOM].open && <span className={styles.borderBottom}></span>}
      {!block.sides[RIGHT].open && <span className={styles.borderRight}></span>}
    </StyledBlock>
  )
};

export default SingleBlock;
