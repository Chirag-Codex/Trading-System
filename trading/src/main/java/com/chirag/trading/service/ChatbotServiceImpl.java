//package com.chirag.trading.service;
//
//import com.chirag.trading.Dto.CoinDto;
//import com.chirag.trading.response.ApiResponse;
//import org.json.JSONArray;
//import org.json.JSONObject;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//import java.util.Map;
//
//@Service
//public class ChatbotServiceImpl implements ChatbotService {
//
//    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
//    private final String GEMINI_API_KEY = "AIzaSyAWzSpwWEHdLAX_KQTJaVOiqkNG3LiCef0";
//
//    private double convertToDouble(Object value) {
//        if (value instanceof Number) {
//            return ((Number) value).doubleValue();
//        }
//        throw new IllegalArgumentException("Unsupported Datatype: " + (value != null ? value.getClass().getName() : "null"));
//    }
//
//    public CoinDto makeApiRequest(String currencyId) throws Exception {
//        // Using the dynamic currencyId provided by Gemini
//        String url = "https://api.coingecko.com/api/v3/coins/" + currencyId.toLowerCase();
//        RestTemplate restTemplate = new RestTemplate();
//        try {
//            ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);
//            Map<String, Object> responseBody = responseEntity.getBody();
//
//            if (responseBody != null) {
//                Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
//                Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");
//
//                CoinDto coinDto = new CoinDto();
//                coinDto.setId((String) responseBody.get("id"));
//                coinDto.setName((String) responseBody.get("name"));
//                coinDto.setSymbol((String) responseBody.get("symbol"));
//                coinDto.setImage((String) image.get("large"));
//                coinDto.setCurrentPrice(convertToDouble(((Map<String, Object>) marketData.get("current_price")).get("usd")));
//                // ... map other fields as you did before ...
//                return coinDto;
//            }
//        } catch (Exception e) {
//            throw new Exception("Coin not found or API error: " + currencyId);
//        }
//        throw new Exception("Coin Not Found");
//    }
//
//    @Override
//    public ApiResponse getCoinDetails(String prompt) throws Exception {
//        RestTemplate restTemplate = new RestTemplate();
//
//
//        JSONObject getCoinDetailsDecl = new JSONObject()
//                .put("name", "getCoinDetails")
//                .put("description", "Get the current market data for a specific cryptocurrency.")
//                .put("parameters", new JSONObject()
//                        .put("type", "OBJECT")
//                        .put("properties", new JSONObject()
//                                .put("coinName", new JSONObject()
//                                        .put("type", "STRING")
//                                        .put("description", "The id of the coin on CoinGecko, e.g., bitcoin, ethereum, solana")))
//                        .put("required", new JSONArray().put("coinName")));
//
//
//        JSONArray tools = new JSONArray().put(new JSONObject()
//                .put("function_declarations", new JSONArray().put(getCoinDetailsDecl)));
//
//
//        JSONObject requestBody = new JSONObject()
//                .put("contents", new JSONArray().put(new JSONObject()
//                        .put("role", "user")
//                        .put("parts", new JSONArray().put(new JSONObject().put("text", prompt)))))
//                .put("tools", tools);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
//
//        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL + GEMINI_API_KEY, entity, String.class);
//        JSONObject responseJson = new JSONObject(response.getBody());
//
//        // 3. Check for functionCall in the response
//        JSONArray candidates = responseJson.getJSONArray("candidates");
//        JSONObject firstCandidate = candidates.getJSONObject(0);
//        JSONArray parts = firstCandidate.getJSONObject("content").getJSONArray("parts");
//        JSONObject firstPart = parts.getJSONObject(0);
//
//        if (firstPart.has("functionCall")) {
//            JSONObject fc = firstPart.getJSONObject("functionCall");
//            String coinName = fc.getJSONObject("args").getString("coinName");
//
//
//            CoinDto data = makeApiRequest(coinName);
//
//            return getFunctionResponse(prompt, fc, data);
//        }
//
//        ApiResponse apiResponse = new ApiResponse();
//        apiResponse.setMessage(firstPart.getString("text"));
//        return apiResponse;
//    }
//
//    private ApiResponse getFunctionResponse(String userPrompt, JSONObject functionCall, CoinDto coinData) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        JSONArray contents = new JSONArray();
//
//        contents.put(new JSONObject().put("role", "user")
//                .put("parts", new JSONArray().put(new JSONObject().put("text", userPrompt))));
//
//
//        contents.put(new JSONObject().put("role", "model")
//                .put("parts", new JSONArray().put(new JSONObject().put("functionCall", functionCall))));
//
//        JSONObject functionResponse = new JSONObject()
//                .put("name", "getCoinDetails")
//                .put("response", new JSONObject().put("content", new JSONObject()
//                        .put("name", coinData.getName())
//                        .put("price", coinData.getCurrentPrice())
//                        .put("symbol", coinData.getSymbol())
//                        .put("market_cap", coinData.getMarketCap())));
//
//        contents.put(new JSONObject().put("role", "function")
//                .put("parts", new JSONArray().put(new JSONObject().put("functionResponse", functionResponse))));
//
//        JSONObject finalRequest = new JSONObject().put("contents", contents);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<String> entity = new HttpEntity<>(finalRequest.toString(), headers);
//
//        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL + GEMINI_API_KEY, entity, String.class);
//        JSONObject finalJson = new JSONObject(response.getBody());
//
//        String aiFinalText = finalJson.getJSONArray("candidates").getJSONObject(0)
//                .getJSONObject("content").getJSONArray("parts").getJSONObject(0).getString("text");
//
//        ApiResponse res = new ApiResponse();
//        res.setMessage(aiFinalText);
//        return res;
//    }
//
//    @Override
//    public String simpleChat(String prompt) {
//        RestTemplate restTemplate = new RestTemplate();
//        JSONObject requestBody = new JSONObject().put("contents", new JSONArray()
//                .put(new JSONObject().put("parts", new JSONArray()
//                        .put(new JSONObject().put("text", prompt)))));
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody.toString(), headers);
//
//        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL + GEMINI_API_KEY, requestEntity, String.class);
//        return response.getBody();
//    }
//}
//
//

package com.chirag.trading.service;

import com.chirag.trading.Dto.CoinDto;
import com.chirag.trading.response.ApiResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private final String GEMINI_API_KEY = "AIzaSyAWzSpwWEHdLAX_KQTJaVOiqkNG3LiCef0";
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Senior Optimization: Centralized Tool Definition
     * Ensures the AI knows exactly what data we can provide.
     */
    private JSONObject getCoinDetailsTool() {
        return new JSONObject()
                .put("name", "getCoinDetails")
                .put("description", "Get comprehensive market data for a cryptocurrency including price, rank, and market cap.")
                .put("parameters", new JSONObject()
                        .put("type", "OBJECT")
                        .put("properties", new JSONObject()
                                .put("coinId", new JSONObject()
                                        .put("type", "STRING")
                                        .put("description", "The id of the coin on CoinGecko (e.g., 'bitcoin', 'ethereum')")))
                        .put("required", new JSONArray().put("coinId")));
    }

    public CoinDto fetchMarketData(String coinId) throws Exception {
        // Standardizing the ID to lowercase for CoinGecko compatibility
        String url = "https://api.coingecko.com/api/v3/coins/" + coinId.toLowerCase();
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> responseBody = responseEntity.getBody();

            if (responseBody != null) {
                // Nested data extraction
                Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
                Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");

                CoinDto coinDto = new CoinDto();

                // 1. Basic Metadata
                coinDto.setId((String) responseBody.get("id"));
                coinDto.setName((String) responseBody.get("name"));
                coinDto.setSymbol((String) responseBody.get("symbol"));
                coinDto.setImage(image != null ? (String) image.get("large") : "");

                // 2. Price and Rank Data (Using safeDouble to prevent 500 errors)
                if (marketData != null) {
                    Map<String, Object> currentPrice = (Map<String, Object>) marketData.get("current_price");
                    Map<String, Object> marketCap = (Map<String, Object>) marketData.get("market_cap");
                    Map<String, Object> high24h = (Map<String, Object>) marketData.get("high_24h");
                    Map<String, Object> low24h = (Map<String, Object>) marketData.get("low_24h");

                    coinDto.setCurrentPrice(safeDouble(currentPrice.get("usd")));
                    coinDto.setMarketCap(safeDouble(marketCap.get("usd")));

                    // Mapping the specific field you needed for the chatbot
                    coinDto.setMarketCapRank(safeDouble(responseBody.get("market_cap_rank")));

                    // Additional 24h stats for a better bot response
                    coinDto.setHigh24h(safeDouble(high24h != null ? high24h.get("usd") : null));
                    coinDto.setLow24h(safeDouble(low24h != null ? low24h.get("usd") : null));
                    coinDto.setPriceChange24h(safeDouble(marketData.get("price_change_24h")));
                    coinDto.setPriceChangePercentage24h(safeDouble(marketData.get("price_change_percentage_24h")));
                }

                return coinDto;
            }
        } catch (Exception e) {
            // Log the error so you can see why it failed in the IDE console
            System.err.println("API Error for " + coinId + ": " + e.getMessage());
            throw new Exception("Cryptocurrency details not found for: " + coinId);
        }
        throw new Exception("Coin Not Found");
    }

    /**
     * Senior Level Helper: Safe conversion of Object to Double.
     * Prevents ClassCastException if the API returns Integer or Long.
     */
    private Double safeDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        // Handle cases where the value might be a String representation
        try {
            return Double.parseDouble(value.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }

    @Override
    public ApiResponse getCoinDetails(String prompt) throws Exception {
        JSONArray tools = new JSONArray().put(new JSONObject()
                .put("function_declarations", new JSONArray().put(getCoinDetailsTool())));

        JSONObject requestBody = new JSONObject()
                .put("contents", new JSONArray().put(new JSONObject()
                        .put("role", "user")
                        .put("parts", new JSONArray().put(new JSONObject().put("text", prompt)))))
                .put("tools", tools);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), createHeaders());
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_BASE_URL + GEMINI_API_KEY, entity, String.class);

        JSONObject resJson = new JSONObject(response.getBody());
        JSONObject firstPart = resJson.getJSONArray("candidates").getJSONObject(0)
                .getJSONObject("content").getJSONArray("parts").getJSONObject(0);

        if (firstPart.has("functionCall")) {
            JSONObject fc = firstPart.getJSONObject("functionCall");
            String coinId = fc.getJSONObject("args").getString("coinId");

            try {
                CoinDto data = fetchMarketData(coinId);
                return getFunctionResponse(prompt, fc, data);
            } catch (Exception e) {
                ApiResponse errRes = new ApiResponse();
                errRes.setMessage("I found the coin '" + coinId + "', but I couldn't fetch its data right now.");
                return errRes;
            }
        }

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage(firstPart.optString("text", "I'm not sure how to answer that."));
        return apiResponse;
    }

    /**
     * Optimized Function Response:
     * We pass the Market Cap Rank back to the AI so it can "read" it to the user.
     */
    private ApiResponse getFunctionResponse(String userPrompt, JSONObject functionCall, CoinDto coinData) {
        JSONArray contents = new JSONArray();

        // 1. Original User Prompt
        contents.put(new JSONObject().put("role", "user")
                .put("parts", new JSONArray().put(new JSONObject().put("text", userPrompt))));

        // 2. Model's Decision to call function
        contents.put(new JSONObject().put("role", "model")
                .put("parts", new JSONArray().put(new JSONObject().put("functionCall", functionCall))));

        // 3. The Result of the function (Including Rank)
        JSONObject functionResponseData = new JSONObject()
                .put("name", "getCoinDetails")
                .put("response", new JSONObject().put("content", new JSONObject()
                        .put("name", coinData.getName())
                        .put("price_usd", coinData.getCurrentPrice())
                        .put("market_cap_rank", coinData.getMarketCapRank()) // Crucial addition
                        .put("symbol", coinData.getSymbol())
                        .put("market_cap_usd", coinData.getMarketCap())));

        contents.put(new JSONObject().put("role", "function")
                .put("parts", new JSONArray().put(new JSONObject().put("functionResponse", functionResponseData))));

        HttpEntity<String> entity = new HttpEntity<>(new JSONObject().put("contents", contents).toString(), createHeaders());
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_BASE_URL + GEMINI_API_KEY, entity, String.class);

        String aiFinalText = new JSONObject(response.getBody())
                .getJSONArray("candidates").getJSONObject(0)
                .getJSONObject("content").getJSONArray("parts").getJSONObject(0).getString("text");
        String cleanText = aiFinalText.replaceAll("\\*\\*", "");
        ApiResponse res = new ApiResponse();
        res.setMessage(cleanText);
        return res;
    }

    @Override
    public String simpleChat(String prompt) {
        JSONObject requestBody = new JSONObject().put("contents", new JSONArray()
                .put(new JSONObject().put("parts", new JSONArray()
                        .put(new JSONObject().put("text", prompt)))));

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), createHeaders());

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_BASE_URL + GEMINI_API_KEY, entity, String.class);
            JSONObject json = new JSONObject(response.getBody());
            // Senior Optimization: Extract ONLY the text so the frontend doesn't get raw JSON
            return json.getJSONArray("candidates").getJSONObject(0)
                    .getJSONObject("content").getJSONArray("parts")
                    .getJSONObject(0).getString("text");
        } catch (Exception e) {
            return "Error: Unable to process chat.";
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}