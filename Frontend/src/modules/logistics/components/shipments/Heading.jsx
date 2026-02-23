import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS
import { useTranslation } from 'react-i18next';

import FlexBox from '@/components/flexbox/FlexBox';
import Percentage from '@/components/percentage'; // ==============================================================

// ==============================================================
export default function Heading({
  title,
  subtitle,
  percentage,
  percentageType = 'success'
}) {
  const { t } = useTranslation();
  return <div>
      <FlexBox alignItems="center" gap={1}>
        <Typography variant="body2" fontWeight={600} fontSize={20} lineHeight={1.2}>
          {title}
        </Typography>

        <Percentage type={percentageType}>{percentage}</Percentage>
      </FlexBox>

      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </div>;
}