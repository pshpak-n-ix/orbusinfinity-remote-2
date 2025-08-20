import { useState, useEffect } from 'react';
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Card,
  CardHeader,
  Text,
  Skeleton,
  SkeletonItem,
  Avatar,
} from '@fluentui/react-components';
import {
  ChartMultiple24Filled,
  People24Filled,
  Cart24Filled,
  ArrowTrendingLines24Filled,
} from '@fluentui/react-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageContentWrapper } from '@orbusinfinity-shared/ui-components';

const mainStatsData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: ChartMultiple24Filled,
    color: tokens.colorPaletteGreenForeground1,
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1% from last month',
    icon: People24Filled,
    color: tokens.colorPaletteGreenForeground1,
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19% from last month',
    icon: Cart24Filled,
    color: tokens.colorPaletteGreenForeground1,
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '+201 since last hour',
    icon: ArrowTrendingLines24Filled,
    color: tokens.colorPaletteBlueForeground2,
  },
];

const overviewData = [
  { name: 'Jan', total: 4200 },
  { name: 'Feb', total: 3100 },
  { name: 'Mar', total: 4500 },
  { name: 'Apr', total: 2900 },
  { name: 'May', total: 5100 },
  { name: 'Jun', total: 4800 },
  { name: 'Jul', total: 5300 },
  { name: 'Aug', total: 4900 },
  { name: 'Sep', total: 5500 },
  { name: 'Oct', total: 5800 },
  { name: 'Nov', total: 6100 },
  { name: 'Dec', total: 6500 },
];

const recentSalesData = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
  },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
  },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
];

const pieChartData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'Other', value: 100 },
];
const PIE_COLORS = [
  tokens.colorPaletteBlueBorderActive,
  tokens.colorPaletteGreenBorderActive,
  tokens.colorPaletteYellowBorderActive,
  tokens.colorPaletteRedBorderActive,
];

const useStyles = makeStyles({
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gridTemplateRows: 'auto',
    gap: tokens.spacingHorizontalL,
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
  card: {
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderColor(tokens.colorTransparentStroke),
  },
  statCardContent: {
    marginTop: tokens.spacingVerticalS,
  },
  chartCard: {
    gridColumn: '1 / -1', 
    '@media (min-width: 768px)': {
      gridColumn: 'span 2',
    },
  },
  listCard: {
    gridColumn: '1 / -1',
    '@media (min-width: 1024px)': {
      gridColumn: 'span 1',
    },
    '@media (min-width: 768px)': {
      gridColumn: 'span 2',
    },
  },
  recentSalesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  saleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  saleItemText: {
    flexGrow: 1,
  },
  chartContainer: {
    height: '320px',
  },
});

const CardSkeleton = () => {
  const styles = useStyles();
  return (
    <Card className={styles.card}>
      <Skeleton>
        <SkeletonItem
          style={{
            width: '40%',
            height: '20px',
            marginBottom: tokens.spacingVerticalS,
          }}
        />
        <SkeletonItem
          style={{
            width: '60%',
            height: '28px',
            marginBottom: tokens.spacingVerticalM,
          }}
        />
        <SkeletonItem style={{ width: '70%', height: '16px' }} />
      </Skeleton>
    </Card>
  );
};

const ChartSkeleton = ({ className }: { className?: string }) => {
  const styles = useStyles();
  return (
    <Card className={mergeClasses(styles.card, className)}>
      <Skeleton>
        <SkeletonItem style={{ width: '100%', height: '320px' }} />
      </Skeleton>
    </Card>
  );
};

const ListSkeleton = ({ className }: { className?: string }) => {
  const styles = useStyles();
  return (
    <Card className={mergeClasses(styles.card, className)}>
      <Skeleton>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacingHorizontalM,
              marginBottom: tokens.spacingVerticalL,
            }}
          >
            <SkeletonItem
              shape='circle'
              style={{ width: '40px', height: '40px' }}
            />
            <div style={{ flexGrow: 1 }}>
              <SkeletonItem
                style={{ width: '75%', height: '16px', marginBottom: '4px' }}
              />
              <SkeletonItem style={{ width: '50%', height: '16px' }} />
            </div>
            <SkeletonItem style={{ width: '25%', height: '20px' }} />
          </div>
        ))}
      </Skeleton>
    </Card>
  );
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}) => {
  const styles = useStyles();
  return (
    <Card className={styles.card}>
      <CardHeader
        image={<Avatar color='brand' icon={<Icon />} />}
        header={<Text weight='semibold'>{title}</Text>}
      />
      <div className={styles.statCardContent}>
        <Text size={700} weight='bold'>
          {value}
        </Text>
        <Text size={200} style={{ color }}>
          {change}
        </Text>
      </div>
    </Card>
  );
};

const OverviewChart = ({ className }: { className?: string }) => {
  const styles = useStyles();
  return (
    <Card className={mergeClasses(styles.card, className)}>
      <CardHeader header={<Text weight='semibold'>Revenue Overview</Text>} />
      <div className={styles.chartContainer}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={overviewData}
            margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              stroke={tokens.colorNeutralStroke2}
              strokeDasharray='3 3'
              vertical={false}
            />
            <XAxis
              dataKey='name'
              stroke={tokens.colorNeutralForeground3}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={tokens.colorNeutralForeground3}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `$${value / 1000}K`}
            />
            <Tooltip
              cursor={{ fill: tokens.colorNeutralBackground4 }}
              contentStyle={{
                backgroundColor: tokens.colorNeutralBackground1,
                border: `1px solid ${tokens.colorNeutralStroke2}`,
                borderRadius: tokens.borderRadiusMedium,
              }}
            />
            <Bar
              dataKey='total'
              fill={tokens.colorBrandBackground}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const RecentSales = ({ className }: { className?: string }) => {
  const styles = useStyles();
  return (
    <Card className={mergeClasses(styles.card, className)}>
      <CardHeader header={<Text weight='semibold'>Recent Sales</Text>} />
      <div className={styles.recentSalesContainer}>
        {recentSalesData.map((sale, index) => (
          <div key={index} className={styles.saleItem}>
            <Avatar name={sale.name} color='colorful' />
            <div className={styles.saleItemText}>
              <Text weight='semibold' block>
                {sale.name}
              </Text>
              <Text size={200} block>
                {sale.email}
              </Text>
            </div>
            <Text weight='semibold'>{sale.amount}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

const DevicePieChart = ({ className }: { className?: string }) => {
  const styles = useStyles();
  return (
    <Card className={mergeClasses(styles.card, className)}>
      <CardHeader header={<Text weight='semibold'>Traffic by Device</Text>} />
      <div className={styles.chartContainer}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={pieChartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tokens.colorNeutralBackground1,
                border: `1px solid ${tokens.colorNeutralStroke2}`,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const DashboardMock = () => {
  const [isLoading, setIsLoading] = useState(true);
  const styles = useStyles();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContentWrapper title='Dashboard'>
      <div className={styles.mainGrid}>
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
            <ChartSkeleton className={styles.chartCard} />
            <ListSkeleton className={styles.listCard} />
            <ChartSkeleton className={styles.listCard} />
          </>
        ) : (
          <>
            {mainStatsData.map(stat => (
              <StatCard key={stat.title} {...stat} />
            ))}
            <OverviewChart className={styles.chartCard} />
            <RecentSales className={styles.listCard} />
            <DevicePieChart className={styles.listCard} />
          </>
        )}
      </div>
    </PageContentWrapper>
  );
};

export default DashboardMock;
