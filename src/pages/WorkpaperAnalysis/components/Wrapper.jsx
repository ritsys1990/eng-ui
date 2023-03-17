import React, { useState, useRef, useEffect } from 'react';
import { Flex, useWindowSize, Spinner, Container, Breadcrumbs } from 'cortex-look-book';

const COMPONENT_NAME = 'Wrapper';

const Wrapper = ({ isLoading, crumbs, children, dataInstance }) => {
  const windowSize = useWindowSize();
  const [frameHeight, setFrameHeight] = useState();
  const wrapperRef = useRef();

  useEffect(() => {
    const height = windowSize.height - wrapperRef.current.getBoundingClientRect().top;
    setFrameHeight(height);
  }, [wrapperRef.current, windowSize]);

  return (
    <div ref={wrapperRef}>
      <Spinner
        height={frameHeight}
        spinning={isLoading}
        overlayOpacity={0}
        size={32}
        pathSize={4}
        label=''
        optionalRender
        dataInstance={`${dataInstance}_${COMPONENT_NAME}`}
      >
        <Container backgroundColor='white' pt={11} height='100%' display='flex' flexDirection='column'>
          <Flex justifyContent='space-between' alignItems='center' fontSize='s' mb={9}>
            <Breadcrumbs crumbs={crumbs} fontWeight='m' fontSize='s' />
          </Flex>
          {children}
        </Container>
      </Spinner>
    </div>
  );
};

export default Wrapper;
