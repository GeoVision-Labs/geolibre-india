import type { IdentifyResult } from '../../types/IdentifyResult';
import '../FeatureInfo.css';

type FeatureInforPorps = {
        feature: IdentifyResult | null;
        onClose?: () => void;
};

function FeatureInfo({feature, onClose}: FeatureInforPorps) {
        if(!feature) {
                return(
                        <div className="feature-info">
                                <h3>Feature Information</h3>
                                <p>Click a feature on the map</p>
                        </div>
                );
        }

        const attributes = Object.entries(feature.properties).filter(
                ([, value]) => 
                        value !== null &&
                        value !== undefined &&
                        value !== ""
        );

        return (
                <div className="feature-info">
                        <div className='feature-info-header'>
                                <h3>Feature Information</h3>
                                {feature && (
                                        <button className='feature-info-close'
                                        onClick={onClose}
                                        aria-label='Close feature information'>
                                                X
                                        </button>
                                )}
                        </div>
                        {feature && (
                                <div className='feature-metadata'>
                                        <div className='feature-row'>
                                                <span>Feature ID</span>
                                                <strong>{feature.id}</strong>
                                        </div>

                                        <div className='feature-row'>
                                                <span>Geometry</span>
                                                <strong>{feature.geometryType}</strong>
                                        </div>
                                        <div className='feature-row'>
                                                <span>Layer</span>
                                                <strong>{feature.layerId}</strong>
                                        </div>
                                </div>
                        )}
                        <div className='feature-attributes'>
                                {attributes.map(([key, value]) => (
                                        <div className="feature-row" key={key} >
                                                <span>
                                                        {key.replace(/([A-Z])/g, " $1")
                                                        .replace(/^./, (char) => char.toUpperCase())}
                                                </span>
                                                <strong>
                                                        {typeof value === "object"
                                                        ? JSON.stringify(value)
                                                        : String(value)}
                                                </strong>
                                        </div>
                                ))}
                        </div>
                </div>
        );
}

export default FeatureInfo;