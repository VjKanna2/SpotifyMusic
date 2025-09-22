import React, { useRef, useState } from 'react'

const InfiniteScroll = ({ containerClass, items, itemHeight, containerHeight, render }) => {

    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    const totalHeight = items.length * itemHeight;
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

    const visibleItems = items.slice(startIndex, endIndex);

    const onScroll = () => {
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop);
        }
    }

    return (
        <div
            ref={containerRef}
            className={`relative overflow-y-auto ${containerClass}`}
            style={{ maxHeight: `${containerHeight}px` }}
            onScroll={onScroll}
        >
            <div className='relative' style={{ height: `${totalHeight}px` }}>
                {visibleItems.map((item, index) => (
                    <div key={startIndex + index}
                        style={{
                            position: "absolute",
                            top: `${(startIndex + index) * itemHeight}px`,
                            height: `${itemHeight}px`,
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        {render(item, index)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfiniteScroll
