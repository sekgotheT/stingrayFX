// controllers/systemController.js
exports.getSystemFeatures = (req, res) => {
    res.json({
        features: [
            "Signal provision based on combined indicators",
            "Pivot points for TP and reversals",
            "Precise entries",
            "90% winning rate",
            "Supports indices, currencies, precious metals, and crypto",
        ],
    });
};
