package com.livio.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Approximate rent estimation per city and sharing type.
 * Used at import time and as a read-time fallback for listings without prices.
 */
public final class PriceEstimator {

    private PriceEstimator() {
    }

    public static Double estimate(String city, String sharingType) {
        String cityKey = city != null ? city.toLowerCase() : "bangalore";
        String sharing = sharingType != null ? sharingType.toUpperCase() : "SINGLE";

        Map<String, Double> basePrices = new HashMap<>();
        basePrices.put("mumbai", 15000.0);
        basePrices.put("bangalore", 10000.0);
        basePrices.put("bengaluru", 10000.0);
        basePrices.put("delhi", 12000.0);
        basePrices.put("pune", 8000.0);
        basePrices.put("hyderabad", 9000.0);
        basePrices.put("chennai", 8500.0);
        basePrices.put("kolkata", 7000.0);
        basePrices.put("gurugram", 14000.0);
        basePrices.put("gurgaon", 14000.0);
        basePrices.put("noida", 9000.0);
        basePrices.put("ghaziabad", 7000.0);

        double base = basePrices.getOrDefault(cityKey, 10000.0);

        double multiplier = switch (sharing) {
            case "SINGLE" -> 1.3;
            case "DOUBLE" -> 1.0;
            case "TRIPLE" -> 0.75;
            case "QUAD" -> 0.6;
            default -> 1.0;
        };

        return Math.round(base * multiplier / 500.0) * 500.0;
    }

    /**
     * Fills all price fields with approximate values when none of them are set
     * (null or zero). Returns true if estimates were applied.
     */
    public static boolean applyIfMissing(com.livio.entity.PG pg) {
        boolean hasPrice = isSet(pg.getPrice())
                || isSet(pg.getPriceSingle())
                || isSet(pg.getPriceDouble())
                || isSet(pg.getPriceTriple());
        if (hasPrice) {
            return false;
        }
        String city = pg.getCity();
        Double single = estimate(city, "SINGLE");
        Double dbl = estimate(city, "DOUBLE");
        Double triple = estimate(city, "TRIPLE");
        pg.setPrice(single);
        pg.setPriceSingle(single);
        pg.setPriceDouble(dbl);
        pg.setPriceTriple(triple);
        return true;
    }

    private static boolean isSet(Double value) {
        return value != null && value > 0;
    }
}
