import type { IdentifyResult } from "../../types/IdentifyResult";
import './IdentifyResults.css';

type IdentifyResultsProps = {
        results: IdentifyResult[];
        onSelect: (feature: IdentifyResult) => void;
        onClose: () => void;
        onHover?: (feature: IdentifyResult) => void;
        onHoverEnd?: () => void;
};

function IdentifyResults({results, onSelect, onClose, onHover, onHoverEnd}: IdentifyResultsProps) {
        
        return (
                <div className="identify-results">
                        <div className="identify-results-header">
                                <strong>Identify Results</strong>
                                <button type="button" onClick={onClose} aria-label="close" 
                                >
                                        X
                                </button>
                        </div>
                        <div className="identify-results-list">
                                {results.map((feature) => (
                                        <button
                                        className="identify-results-id"
                                        type="button"
                                        key={`${feature.layerId}-${feature.id}`}
                                        onClick={() => onSelect(feature)}
                                        onMouseEnter={() => onHover?.(feature)}
                                        onMouseLeave={() => onHoverEnd?.()}>
                                                <div className="identify-results-id">
                                                        {String(feature.id)}
                                                </div>
                                                <div className="identify-results-meta">
                                                        {feature.geometryType} . {feature.layerId}
                                                </div>
                                        </button>
                                ))}
                        </div>
                </div>
        )
}

export default IdentifyResults;