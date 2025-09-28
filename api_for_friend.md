# Amendment Analytics API - Simple Integration Specification

## Overview
Simple API to receive amendment names and return analytics data.

## Required Endpoint

### POST /api/get-amendment-analytics

**Request:**
```json
{
    "amendment_name": "Digital Privacy Protection Act 2025"
}
```

**Response (Success):**
```json
{
    "success": true,
    "amendment_name": "Digital Privacy Protection Act 2025",
    "analytics": {
        "total_positive": 812,
        "total_negative": 249,
        "total_neutral": 186,
        "pros": [
            "Strengthens privacy rights",
            "Increases transparency",
            "User control over data",
            "International compliance",
            "Prevents data misuse"
        ],
        "cons": [
            "Higher business costs",
            "Slower innovation",
            "Complex implementation",
            "Reduced personalization",
            "Enforcement challenges"
        ],
        "summary": "Citizens support privacy protection but worry about business impact. Most appreciate stronger data rights. Implementation concerns exist but overall positive.",
        "demographics": {
            "18-25": {"positive": 98, "negative": 32, "neutral": 26},
            "26-35": {"positive": 223, "negative": 67, "neutral": 52},
            "36-45": {"positive": 261, "negative": 79, "neutral": 58}
        },
        "click_rate": 58,
        "response_rate": 8.1
    }
}
```

**Response (Error):**
```json
{
    "success": false,
    "error": "Amendment not found in database"
}
```

## Implementation Notes
- Use POST method
- Accept JSON content-type
- Return JSON response
- Include proper HTTP status codes (200 success, 404 not found)
- Response time should be under 5 seconds

## Authentication
Include in request headers:
```
Authorization: Bearer YOUR-API-KEY
Content-Type: application/json
```

## What Your Friend Needs to Do:

1. **Create the endpoint:** `POST /api/get-amendment-analytics`

2. **Process the request:**
   - Receive amendment name from JSON payload
   - Search your database for citizen feedback on that amendment
   - Run AI sentiment analysis on the feedback data

3. **Return formatted response:**
   - Positive/negative/neutral counts
   - List of 5 pros (positive points citizens mentioned)
   - List of 5 cons (negative points citizens mentioned)  
   - 3-line summary of overall citizen sentiment
   - Demographics breakdown by age group
   - Email engagement metrics

## Example Implementation (Python Flask):

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/get-amendment-analytics', methods=['POST'])
def get_amendment_analytics():
    try:
        # Get amendment name from request
        data = request.json
        amendment_name = data.get('amendment_name')

        if not amendment_name:
            return jsonify({
                "success": False,
                "error": "Amendment name is required"
            }), 400

        # 1. SEARCH YOUR DATABASE
        # Query your database for feedback related to this amendment
        feedback_data = search_database_for_amendment(amendment_name)

        if not feedback_data:
            return jsonify({
                "success": False,
                "error": "Amendment not found in database"
            }), 404

        # 2. RUN AI SENTIMENT ANALYSIS
        # Process the feedback through your AI system
        analysis_results = run_ai_sentiment_analysis(feedback_data)

        # 3. FORMAT AND RETURN RESPONSE
        return jsonify({
            "success": True,
            "amendment_name": amendment_name,
            "analytics": {
                "total_positive": analysis_results['positive_count'],
                "total_negative": analysis_results['negative_count'],
                "total_neutral": analysis_results['neutral_count'],
                "pros": analysis_results['pros_list'],  # List of 5 positive points
                "cons": analysis_results['cons_list'],  # List of 5 negative points
                "summary": analysis_results['summary_text'],  # 3-line summary
                "demographics": analysis_results['age_breakdown'],
                "click_rate": analysis_results['click_rate'],
                "response_rate": analysis_results['response_rate']
            }
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

def search_database_for_amendment(amendment_name):
    """
    YOUR FUNCTION: Search your database for citizen feedback
    related to the given amendment name
    """
    # Your database search logic here
    pass

def run_ai_sentiment_analysis(feedback_data):
    """
    YOUR FUNCTION: Process feedback through your AI sentiment analyzer
    and return structured results
    """
    # Your AI processing logic here
    pass

if __name__ == '__main__':
    app.run(debug=True)
```

## Testing Your Implementation:

```bash
curl -X POST "https://your-api-domain.com/api/get-amendment-analytics" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "amendment_name": "Digital Privacy Protection Act 2025"
  }'
```

## Security Requirements:
- Use HTTPS only
- Implement API key authentication
- Add rate limiting (max 100 requests per minute)
- Validate all input parameters
- Log all requests for monitoring

## Once You Implement This:
1. Deploy your API to a public URL
2. Send me your API URL and API key
3. I'll update the government dashboard to connect to your API
4. System will be ready for citizen feedback analysis!
