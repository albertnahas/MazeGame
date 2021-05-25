import React from 'react';
import Block from '../../models/Block';
import styles from './SingleBlock.module.scss';
import styled, { css, keyframes } from "styled-components";
import { BOTTOM, DIMENSIONS_MEDIUM, LEFT, RIGHT, TOP } from '../../constants';

type Props = {
  block: Block,
  active: boolean,
  size: number
}

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
const StyledBlock = styled.span<{ block: Block, colored: boolean, size: number }>`
width: ${(props: any) => `${props.size}px`};
height: ${(props: any) => `${props.size}px`};
display:inline-block;
box-sizing:border-box;
position:relative;
background:${(props: any) => getBackground(props.block, props.colored, props.size)};
${({ size }) =>
    size >= DIMENSIONS_MEDIUM ? css`animation: ${animation} 1s linear infinite;` : ``
  };
background-size: 200% 200%;
`;

const SingleBlock: React.FC<Props> = (props: Props) => {
  const { block, active, size } = props;
  return block ? (
    <StyledBlock size={size} colored={active} block={block} >
      {!block.sides[TOP].open && <span className={styles.borderTop}></span>}
      {!block.sides[LEFT].open && <span className={styles.borderLeft}></span>}
      {!block.sides[BOTTOM].open && <span className={styles.borderBottom}></span>}
      {!block.sides[RIGHT].open && <span className={styles.borderRight}></span>}
    </StyledBlock>
  ) : <></>
};

export default SingleBlock;
