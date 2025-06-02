
import React, { memo, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

interface VirtualizedProductListProps {
  products: Product[];
  itemsPerRow?: number;
  itemHeight?: number;
  itemWidth?: number;
  gap?: number;
}

interface ItemData {
  products: Product[];
  itemsPerRow: number;
  itemWidth: number;
}

const ProductGridItem = memo(({ 
  columnIndex, 
  rowIndex, 
  style, 
  data 
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: ItemData;
}) => {
  const { products, itemsPerRow, itemWidth } = data;
  const index = rowIndex * itemsPerRow + columnIndex;
  const product = products[index];

  if (!product) return null;

  return (
    <div style={{
      ...style,
      padding: '8px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ width: itemWidth }}>
        <ProductCard product={product} viewMode="grid" />
      </div>
    </div>
  );
});

ProductGridItem.displayName = 'ProductGridItem';

// Simple AutoSizer replacement
const SimpleAutoSizer = ({ children }: { children: (size: { height: number; width: number }) => React.ReactNode }) => {
  const [size, setSize] = React.useState({ width: 800, height: 600 });

  React.useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('[data-autosizer]');
      if (container) {
        setSize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return <div data-autosizer className="w-full h-full">{children(size)}</div>;
};

const VirtualizedProductList: React.FC<VirtualizedProductListProps> = memo(({
  products,
  itemsPerRow = 4,
  itemHeight = 320,
  itemWidth = 250,
  gap = 16,
}) => {
  const itemData = useMemo((): ItemData => ({
    products,
    itemsPerRow,
    itemWidth,
  }), [products, itemsPerRow, itemWidth]);

  const rowCount = Math.ceil(products.length / itemsPerRow);
  const columnCount = itemsPerRow;

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Aucun produit trouvé
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full">
      <SimpleAutoSizer>
        {({ height, width }) => {
          // Calculate responsive items per row
          const responsiveItemsPerRow = Math.floor(width / (itemWidth + gap));
          const actualItemsPerRow = Math.max(1, Math.min(responsiveItemsPerRow, itemsPerRow));
          const actualRowCount = Math.ceil(products.length / actualItemsPerRow);
          
          const responsiveItemData = {
            ...itemData,
            itemsPerRow: actualItemsPerRow,
          };

          return (
            <Grid
              height={height}
              width={width}
              columnCount={actualItemsPerRow}
              rowCount={actualRowCount}
              columnWidth={(width - gap * (actualItemsPerRow - 1)) / actualItemsPerRow}
              rowHeight={itemHeight + gap}
              itemData={responsiveItemData}
              overscanRowCount={1}
              overscanColumnCount={1}
            >
              {ProductGridItem}
            </Grid>
          );
        }}
      </SimpleAutoSizer>
    </div>
  );
});

VirtualizedProductList.displayName = 'VirtualizedProductList';

export default VirtualizedProductList;
