import '../FeatureInfo.css';

type FeatureInforPorps = {
        feature: {
                assetType?: string;
                assetId?: string;
                status?: string;
                [key: string]: unknown;
        } | null;
};

function FeatureInfo({feature}: FeatureInforPorps) {
        if(!feature) {
                return(
                        <div className="feature-info">
                                <h3>Feature Information</h3>
                                <p>Click a feature on the map</p>
                        </div>
                );
        }

        return (
                <div className="feature-info">
                        <h3>Feature Information</h3>
                        <div className="feature-row" >
                                <span>Asset Type</span>
                                <strong>{feature?.assetType ?? "-"}</strong>
                        </div>
                        <div className="feature-row" >
                                <span>Asset ID</span>
                                <strong>{feature?.assetId ?? "-"}</strong>
                        </div>
                        <div className="feature-row" >
                                <span>Status</span>
                                <strong>{feature?.status ?? "-"}</strong>
                        </div>
                </div>
        );
}

export default FeatureInfo;