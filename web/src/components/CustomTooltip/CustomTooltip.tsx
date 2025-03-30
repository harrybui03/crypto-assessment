import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import styles from './CustomTooltip.module.css';
import {formatDate, formatTime} from "../../utils/utils.ts";

const CustomTooltip = ({active,payload, label}: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className={styles.tooltipContainer}>
            <p className={styles.tooltipDate}>
                {formatDate(label)}
                <br />
                {formatTime(label)}
            </p>
            <p className={styles.tooltipPrice}>
                Price: ${payload[0].value?.toLocaleString()}
            </p>
        </div>
    );
};

export default CustomTooltip;