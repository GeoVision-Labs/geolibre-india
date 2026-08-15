import '../FeatureInfo.css';

type FeatureInforPorps = {
        feature: {
                assetType?: string;
                assetId?: string;
                status?: string;
                [key: string]: unknown;
        } | null;
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

        const exclusiveFields = [
                "geometry",
                "type",
                "id",
                "layer",
                "source",
        ];

        const attributes = Object.entries(feature).filter(([key, value]) => 
                !exclusiveFields.includes(key) && value !== null && value !== undefined && value !== ""
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