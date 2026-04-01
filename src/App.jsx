import { useState, useMemo, useRef, useEffect } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, Cell, Legend, ReferenceLine
} from "recharts";

// ── REAL DATASET (213 assets) ──────────────────────────────────────────────
const RAW = [{"Asset_Name":"Apple Inc","Sector":"Technology","Price":186.55,"Expected_Return":14.03,"Risk":0.211,"Liquidity":0.96,"ESG_Score":74,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.43,"Beta":1.22,"Bull_Return_Adjustment":17.38,"Bear_Return_Adjustment":4.3,"Volatility_Shock":0.282},{"Asset_Name":"Microsoft Corp","Sector":"Technology","Price":368.98,"Expected_Return":16.3,"Risk":0.202,"Liquidity":0.99,"ESG_Score":83,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.73,"Beta":0.87,"Bull_Return_Adjustment":20.34,"Bear_Return_Adjustment":4.91,"Volatility_Shock":0.328},{"Asset_Name":"NVIDIA Corp","Sector":"Technology","Price":485.71,"Expected_Return":28.34,"Risk":0.366,"Liquidity":0.98,"ESG_Score":67,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.64,"Bull_Return_Adjustment":34.06,"Bear_Return_Adjustment":10.0,"Volatility_Shock":0.482},{"Asset_Name":"Alphabet Inc","Sector":"Technology","Price":139.66,"Expected_Return":15.42,"Risk":0.257,"Liquidity":0.94,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.1,"Beta":1.06,"Bull_Return_Adjustment":20.08,"Bear_Return_Adjustment":6.8,"Volatility_Shock":0.339},{"Asset_Name":"Meta Platforms","Sector":"Technology","Price":314.78,"Expected_Return":18.19,"Risk":0.283,"Liquidity":0.94,"ESG_Score":52,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.3,"Bull_Return_Adjustment":23.59,"Bear_Return_Adjustment":6.75,"Volatility_Shock":0.444},{"Asset_Name":"Amazon.com Inc","Sector":"Technology","Price":178.25,"Expected_Return":17.78,"Risk":0.263,"Liquidity":0.98,"ESG_Score":63,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.12,"Bull_Return_Adjustment":22.58,"Bear_Return_Adjustment":7.75,"Volatility_Shock":0.381},{"Asset_Name":"Salesforce Inc","Sector":"Technology","Price":252.63,"Expected_Return":14.54,"Risk":0.271,"Liquidity":0.92,"ESG_Score":74,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.09,"Bull_Return_Adjustment":18.85,"Bear_Return_Adjustment":6.47,"Volatility_Shock":0.381},{"Asset_Name":"Adobe Inc","Sector":"Technology","Price":560.42,"Expected_Return":13.8,"Risk":0.265,"Liquidity":0.93,"ESG_Score":68,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.02,"Bull_Return_Adjustment":17.94,"Bear_Return_Adjustment":6.28,"Volatility_Shock":0.359},{"Asset_Name":"Intel Corp","Sector":"Technology","Price":34.5,"Expected_Return":8.22,"Risk":0.3,"Liquidity":0.94,"ESG_Score":62,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.16,"Beta":0.84,"Bull_Return_Adjustment":9.86,"Bear_Return_Adjustment":4.25,"Volatility_Shock":0.38},{"Asset_Name":"Qualcomm Inc","Sector":"Technology","Price":131.67,"Expected_Return":12.5,"Risk":0.269,"Liquidity":0.92,"ESG_Score":67,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.47,"Beta":1.2,"Bull_Return_Adjustment":16.25,"Bear_Return_Adjustment":5.5,"Volatility_Shock":0.371},{"Asset_Name":"Twilio Inc","Sector":"Technology","Price":66.76,"Expected_Return":13.61,"Risk":0.417,"Liquidity":0.82,"ESG_Score":62,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.38,"Bull_Return_Adjustment":17.69,"Bear_Return_Adjustment":5.44,"Volatility_Shock":0.547},{"Asset_Name":"Cloudflare Inc","Sector":"Technology","Price":82.58,"Expected_Return":18.64,"Risk":0.444,"Liquidity":0.82,"ESG_Score":67,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.5,"Bull_Return_Adjustment":24.23,"Bear_Return_Adjustment":7.46,"Volatility_Shock":0.578},{"Asset_Name":"Datadog Inc","Sector":"Technology","Price":127.6,"Expected_Return":16.06,"Risk":0.419,"Liquidity":0.82,"ESG_Score":60,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.39,"Bull_Return_Adjustment":20.88,"Bear_Return_Adjustment":6.42,"Volatility_Shock":0.545},{"Asset_Name":"Palantir Technologies","Sector":"Technology","Price":17.42,"Expected_Return":20.27,"Risk":0.485,"Liquidity":0.78,"ESG_Score":46,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.55,"Bull_Return_Adjustment":26.35,"Bear_Return_Adjustment":8.11,"Volatility_Shock":0.631},{"Asset_Name":"Snowflake Inc","Sector":"Technology","Price":187.0,"Expected_Return":15.71,"Risk":0.426,"Liquidity":0.81,"ESG_Score":57,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.38,"Bull_Return_Adjustment":20.42,"Bear_Return_Adjustment":6.28,"Volatility_Shock":0.554},{"Asset_Name":"Johnson & Johnson","Sector":"Healthcare","Price":160.74,"Expected_Return":8.92,"Risk":0.143,"Liquidity":0.97,"ESG_Score":76,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.97,"Beta":0.57,"Bull_Return_Adjustment":10.7,"Bear_Return_Adjustment":5.35,"Volatility_Shock":0.185},{"Asset_Name":"UnitedHealth Group","Sector":"Healthcare","Price":490.27,"Expected_Return":11.54,"Risk":0.189,"Liquidity":0.97,"ESG_Score":71,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.35,"Beta":0.75,"Bull_Return_Adjustment":13.85,"Bear_Return_Adjustment":5.77,"Volatility_Shock":0.247},{"Asset_Name":"Pfizer Inc","Sector":"Healthcare","Price":28.81,"Expected_Return":7.72,"Risk":0.199,"Liquidity":0.95,"ESG_Score":78,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.55,"Beta":0.59,"Bull_Return_Adjustment":9.26,"Bear_Return_Adjustment":4.63,"Volatility_Shock":0.258},{"Asset_Name":"Abbott Laboratories","Sector":"Healthcare","Price":106.68,"Expected_Return":9.89,"Risk":0.171,"Liquidity":0.92,"ESG_Score":78,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.96,"Beta":0.69,"Bull_Return_Adjustment":11.87,"Bear_Return_Adjustment":5.93,"Volatility_Shock":0.224},{"Asset_Name":"Eli Lilly & Co","Sector":"Healthcare","Price":573.88,"Expected_Return":18.05,"Risk":0.26,"Liquidity":0.95,"ESG_Score":71,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.82,"Beta":0.45,"Bull_Return_Adjustment":21.66,"Bear_Return_Adjustment":9.03,"Volatility_Shock":0.338},{"Asset_Name":"Merck & Co","Sector":"Healthcare","Price":108.72,"Expected_Return":8.46,"Risk":0.155,"Liquidity":0.96,"ESG_Score":71,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.65,"Beta":0.41,"Bull_Return_Adjustment":10.15,"Bear_Return_Adjustment":5.08,"Volatility_Shock":0.2},{"Asset_Name":"Medtronic PLC","Sector":"Healthcare","Price":80.17,"Expected_Return":8.56,"Risk":0.179,"Liquidity":0.91,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.37,"Beta":0.66,"Bull_Return_Adjustment":10.27,"Bear_Return_Adjustment":5.14,"Volatility_Shock":0.234},{"Asset_Name":"Boston Scientific","Sector":"Healthcare","Price":57.14,"Expected_Return":12.5,"Risk":0.234,"Liquidity":0.89,"ESG_Score":69,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":0.82,"Bull_Return_Adjustment":15.0,"Bear_Return_Adjustment":6.25,"Volatility_Shock":0.305},{"Asset_Name":"Intuitive Surgical","Sector":"Healthcare","Price":332.03,"Expected_Return":14.59,"Risk":0.24,"Liquidity":0.89,"ESG_Score":72,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":0.82,"Bull_Return_Adjustment":17.51,"Bear_Return_Adjustment":7.3,"Volatility_Shock":0.312},{"Asset_Name":"Regeneron Pharma","Sector":"Healthcare","Price":824.44,"Expected_Return":13.61,"Risk":0.251,"Liquidity":0.87,"ESG_Score":67,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":0.46,"Bull_Return_Adjustment":16.33,"Bear_Return_Adjustment":6.81,"Volatility_Shock":0.326},{"Asset_Name":"JPMorgan Chase","Sector":"Finance","Price":183.27,"Expected_Return":11.3,"Risk":0.203,"Liquidity":0.96,"ESG_Score":59,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.51,"Beta":1.08,"Bull_Return_Adjustment":13.56,"Bear_Return_Adjustment":5.65,"Volatility_Shock":0.271},{"Asset_Name":"Bank of America","Sector":"Finance","Price":32.32,"Expected_Return":9.54,"Risk":0.232,"Liquidity":0.98,"ESG_Score":65,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.78,"Beta":1.15,"Bull_Return_Adjustment":11.45,"Bear_Return_Adjustment":4.77,"Volatility_Shock":0.299},{"Asset_Name":"Goldman Sachs","Sector":"Finance","Price":384.47,"Expected_Return":11.83,"Risk":0.245,"Liquidity":0.93,"ESG_Score":56,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.37,"Beta":1.33,"Bull_Return_Adjustment":14.2,"Bear_Return_Adjustment":5.92,"Volatility_Shock":0.318},{"Asset_Name":"Berkshire Hathaway","Sector":"Finance","Price":350.0,"Expected_Return":10.51,"Risk":0.14,"Liquidity":0.97,"ESG_Score":55,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":0.89,"Bull_Return_Adjustment":12.61,"Bear_Return_Adjustment":5.26,"Volatility_Shock":0.182},{"Asset_Name":"Visa Inc","Sector":"Finance","Price":240.68,"Expected_Return":13.26,"Risk":0.19,"Liquidity":0.97,"ESG_Score":68,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.82,"Beta":0.94,"Bull_Return_Adjustment":15.91,"Bear_Return_Adjustment":6.63,"Volatility_Shock":0.247},{"Asset_Name":"Mastercard Inc","Sector":"Finance","Price":411.45,"Expected_Return":13.87,"Risk":0.182,"Liquidity":0.97,"ESG_Score":67,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.58,"Beta":1.04,"Bull_Return_Adjustment":16.64,"Bear_Return_Adjustment":6.94,"Volatility_Shock":0.237},{"Asset_Name":"BlackRock Inc","Sector":"Finance","Price":724.18,"Expected_Return":11.55,"Risk":0.184,"Liquidity":0.94,"ESG_Score":75,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.54,"Beta":1.16,"Bull_Return_Adjustment":13.86,"Bear_Return_Adjustment":5.78,"Volatility_Shock":0.239},{"Asset_Name":"Morgan Stanley","Sector":"Finance","Price":90.06,"Expected_Return":11.51,"Risk":0.255,"Liquidity":0.92,"ESG_Score":62,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.11,"Beta":1.28,"Bull_Return_Adjustment":13.81,"Bear_Return_Adjustment":5.76,"Volatility_Shock":0.331},{"Asset_Name":"Wells Fargo","Sector":"Finance","Price":42.97,"Expected_Return":8.46,"Risk":0.258,"Liquidity":0.95,"ESG_Score":47,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.79,"Beta":1.15,"Bull_Return_Adjustment":10.15,"Bear_Return_Adjustment":4.23,"Volatility_Shock":0.335},{"Asset_Name":"Charles Schwab","Sector":"Finance","Price":57.88,"Expected_Return":9.23,"Risk":0.201,"Liquidity":0.92,"ESG_Score":61,"Market_Cap":"Mid","Region":"US","Dividend_Yield":1.72,"Beta":1.04,"Bull_Return_Adjustment":11.08,"Bear_Return_Adjustment":4.62,"Volatility_Shock":0.261},{"Asset_Name":"ExxonMobil Corp","Sector":"Energy","Price":103.41,"Expected_Return":8.84,"Risk":0.233,"Liquidity":0.94,"ESG_Score":41,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.48,"Beta":1.1,"Bull_Return_Adjustment":10.61,"Bear_Return_Adjustment":4.42,"Volatility_Shock":0.302},{"Asset_Name":"Chevron Corp","Sector":"Energy","Price":152.32,"Expected_Return":8.81,"Risk":0.234,"Liquidity":0.95,"ESG_Score":48,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.82,"Beta":0.97,"Bull_Return_Adjustment":10.57,"Bear_Return_Adjustment":4.41,"Volatility_Shock":0.303},{"Asset_Name":"ConocoPhillips","Sector":"Energy","Price":116.42,"Expected_Return":10.69,"Risk":0.278,"Liquidity":0.94,"ESG_Score":48,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.8,"Beta":1.11,"Bull_Return_Adjustment":12.83,"Bear_Return_Adjustment":5.35,"Volatility_Shock":0.361},{"Asset_Name":"Schlumberger Ltd","Sector":"Energy","Price":50.18,"Expected_Return":11.72,"Risk":0.272,"Liquidity":0.89,"ESG_Score":55,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.19,"Beta":1.22,"Bull_Return_Adjustment":14.06,"Bear_Return_Adjustment":5.86,"Volatility_Shock":0.354},{"Asset_Name":"NextEra Energy","Sector":"Energy","Price":60.51,"Expected_Return":8.25,"Risk":0.147,"Liquidity":0.92,"ESG_Score":82,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.97,"Beta":0.5,"Bull_Return_Adjustment":9.9,"Bear_Return_Adjustment":4.13,"Volatility_Shock":0.192},{"Asset_Name":"Enphase Energy","Sector":"Energy","Price":112.35,"Expected_Return":16.46,"Risk":0.398,"Liquidity":0.84,"ESG_Score":78,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.6,"Bull_Return_Adjustment":21.4,"Bear_Return_Adjustment":8.23,"Volatility_Shock":0.517},{"Asset_Name":"First Solar Inc","Sector":"Energy","Price":176.32,"Expected_Return":15.32,"Risk":0.364,"Liquidity":0.85,"ESG_Score":79,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.39,"Bull_Return_Adjustment":19.91,"Bear_Return_Adjustment":7.66,"Volatility_Shock":0.473},{"Asset_Name":"Pioneer Natural Res","Sector":"Energy","Price":241.59,"Expected_Return":10.15,"Risk":0.253,"Liquidity":0.91,"ESG_Score":48,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.39,"Beta":1.1,"Bull_Return_Adjustment":12.18,"Bear_Return_Adjustment":5.08,"Volatility_Shock":0.329},{"Asset_Name":"Duke Energy Corp","Sector":"Utilities","Price":96.3,"Expected_Return":5.89,"Risk":0.124,"Liquidity":0.92,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":4.27,"Beta":0.39,"Bull_Return_Adjustment":7.07,"Bear_Return_Adjustment":3.53,"Volatility_Shock":0.161},{"Asset_Name":"Southern Company","Sector":"Utilities","Price":68.89,"Expected_Return":5.5,"Risk":0.107,"Liquidity":0.91,"ESG_Score":69,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.9,"Beta":0.45,"Bull_Return_Adjustment":6.6,"Bear_Return_Adjustment":3.3,"Volatility_Shock":0.139},{"Asset_Name":"American Electric Power","Sector":"Utilities","Price":84.93,"Expected_Return":5.46,"Risk":0.124,"Liquidity":0.88,"ESG_Score":74,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.99,"Beta":0.39,"Bull_Return_Adjustment":6.55,"Bear_Return_Adjustment":3.28,"Volatility_Shock":0.161},{"Asset_Name":"Dominion Energy","Sector":"Utilities","Price":47.81,"Expected_Return":4.57,"Risk":0.113,"Liquidity":0.88,"ESG_Score":70,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.44,"Beta":0.44,"Bull_Return_Adjustment":5.48,"Bear_Return_Adjustment":2.74,"Volatility_Shock":0.147},{"Asset_Name":"Consolidated Edison","Sector":"Utilities","Price":91.22,"Expected_Return":4.83,"Risk":0.096,"Liquidity":0.88,"ESG_Score":70,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.37,"Beta":0.39,"Bull_Return_Adjustment":5.8,"Bear_Return_Adjustment":2.9,"Volatility_Shock":0.125},{"Asset_Name":"Xcel Energy Inc","Sector":"Utilities","Price":60.47,"Expected_Return":5.34,"Risk":0.102,"Liquidity":0.87,"ESG_Score":79,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.32,"Beta":0.37,"Bull_Return_Adjustment":6.41,"Bear_Return_Adjustment":3.2,"Volatility_Shock":0.133},{"Asset_Name":"Walmart Inc","Sector":"Consumer","Price":163.27,"Expected_Return":8.17,"Risk":0.139,"Liquidity":0.96,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.37,"Beta":0.59,"Bull_Return_Adjustment":9.8,"Bear_Return_Adjustment":4.09,"Volatility_Shock":0.18},{"Asset_Name":"Procter & Gamble","Sector":"Consumer","Price":147.21,"Expected_Return":8.17,"Risk":0.117,"Liquidity":0.95,"ESG_Score":77,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.44,"Beta":0.53,"Bull_Return_Adjustment":9.8,"Bear_Return_Adjustment":4.09,"Volatility_Shock":0.152},{"Asset_Name":"Coca-Cola Co","Sector":"Consumer","Price":60.19,"Expected_Return":6.25,"Risk":0.103,"Liquidity":0.94,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.15,"Beta":0.6,"Bull_Return_Adjustment":7.5,"Bear_Return_Adjustment":3.13,"Volatility_Shock":0.134},{"Asset_Name":"PepsiCo Inc","Sector":"Consumer","Price":172.77,"Expected_Return":6.73,"Risk":0.11,"Liquidity":0.96,"ESG_Score":75,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.79,"Beta":0.48,"Bull_Return_Adjustment":8.08,"Bear_Return_Adjustment":3.37,"Volatility_Shock":0.143},{"Asset_Name":"McDonald's Corp","Sector":"Consumer","Price":281.55,"Expected_Return":8.27,"Risk":0.127,"Liquidity":0.95,"ESG_Score":62,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.3,"Beta":0.75,"Bull_Return_Adjustment":9.92,"Bear_Return_Adjustment":4.14,"Volatility_Shock":0.165},{"Asset_Name":"Nike Inc","Sector":"Consumer","Price":96.16,"Expected_Return":9.58,"Risk":0.236,"Liquidity":0.94,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.46,"Beta":0.93,"Bull_Return_Adjustment":11.5,"Bear_Return_Adjustment":4.79,"Volatility_Shock":0.306},{"Asset_Name":"Costco Wholesale","Sector":"Consumer","Price":568.13,"Expected_Return":10.38,"Risk":0.172,"Liquidity":0.95,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.72,"Beta":0.76,"Bull_Return_Adjustment":12.46,"Bear_Return_Adjustment":5.19,"Volatility_Shock":0.224},{"Asset_Name":"Home Depot","Sector":"Consumer","Price":294.6,"Expected_Return":10.15,"Risk":0.193,"Liquidity":0.93,"ESG_Score":63,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.54,"Beta":1.03,"Bull_Return_Adjustment":12.18,"Bear_Return_Adjustment":5.08,"Volatility_Shock":0.251},{"Asset_Name":"Amazon Consumer","Sector":"Consumer","Price":178.25,"Expected_Return":15.27,"Risk":0.272,"Liquidity":0.97,"ESG_Score":58,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.15,"Bull_Return_Adjustment":19.85,"Bear_Return_Adjustment":7.64,"Volatility_Shock":0.354},{"Asset_Name":"Target Corp","Sector":"Consumer","Price":130.82,"Expected_Return":7.98,"Risk":0.198,"Liquidity":0.94,"ESG_Score":67,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.37,"Beta":0.81,"Bull_Return_Adjustment":9.58,"Bear_Return_Adjustment":3.99,"Volatility_Shock":0.258},{"Asset_Name":"American Tower Corp","Sector":"Real Estate","Price":196.32,"Expected_Return":7.8,"Risk":0.174,"Liquidity":0.92,"ESG_Score":66,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.06,"Beta":0.73,"Bull_Return_Adjustment":9.36,"Bear_Return_Adjustment":3.9,"Volatility_Shock":0.226},{"Asset_Name":"Prologis Inc","Sector":"Real Estate","Price":117.41,"Expected_Return":8.56,"Risk":0.18,"Liquidity":0.89,"ESG_Score":74,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.08,"Beta":0.95,"Bull_Return_Adjustment":10.27,"Bear_Return_Adjustment":4.28,"Volatility_Shock":0.234},{"Asset_Name":"Crown Castle Inc","Sector":"Real Estate","Price":107.15,"Expected_Return":6.88,"Risk":0.169,"Liquidity":0.88,"ESG_Score":68,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.61,"Beta":0.63,"Bull_Return_Adjustment":8.26,"Bear_Return_Adjustment":3.44,"Volatility_Shock":0.22},{"Asset_Name":"Equinix Inc","Sector":"Real Estate","Price":740.26,"Expected_Return":9.72,"Risk":0.193,"Liquidity":0.89,"ESG_Score":73,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.09,"Beta":0.75,"Bull_Return_Adjustment":11.66,"Bear_Return_Adjustment":4.86,"Volatility_Shock":0.251},{"Asset_Name":"Simon Property Group","Sector":"Real Estate","Price":141.68,"Expected_Return":7.3,"Risk":0.239,"Liquidity":0.88,"ESG_Score":51,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.79,"Beta":1.12,"Bull_Return_Adjustment":8.76,"Bear_Return_Adjustment":3.65,"Volatility_Shock":0.311},{"Asset_Name":"SPDR S&P 500 ETF","Sector":"ETF","Price":451.18,"Expected_Return":10.55,"Risk":0.158,"Liquidity":0.98,"ESG_Score":71,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.54,"Beta":0.96,"Bull_Return_Adjustment":12.66,"Bear_Return_Adjustment":5.28,"Volatility_Shock":0.205},{"Asset_Name":"Invesco QQQ Trust","Sector":"ETF","Price":381.22,"Expected_Return":14.97,"Risk":0.19,"Liquidity":0.99,"ESG_Score":62,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.61,"Beta":1.11,"Bull_Return_Adjustment":17.96,"Bear_Return_Adjustment":7.49,"Volatility_Shock":0.247},{"Asset_Name":"iShares Russell 2000","Sector":"ETF","Price":185.87,"Expected_Return":11.56,"Risk":0.212,"Liquidity":0.99,"ESG_Score":55,"Market_Cap":"Mid","Region":"US","Dividend_Yield":1.08,"Beta":1.17,"Bull_Return_Adjustment":13.87,"Bear_Return_Adjustment":5.78,"Volatility_Shock":0.276},{"Asset_Name":"Vanguard Total Market","Sector":"ETF","Price":232.51,"Expected_Return":11.21,"Risk":0.152,"Liquidity":0.99,"ESG_Score":66,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.45,"Beta":1.01,"Bull_Return_Adjustment":13.45,"Bear_Return_Adjustment":5.61,"Volatility_Shock":0.198},{"Asset_Name":"iShares MSCI EAFE","Sector":"ETF","Price":76.02,"Expected_Return":8.21,"Risk":0.176,"Liquidity":0.96,"ESG_Score":60,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.9,"Beta":0.85,"Bull_Return_Adjustment":9.85,"Bear_Return_Adjustment":4.11,"Volatility_Shock":0.229},{"Asset_Name":"Vanguard Emerging Mkt","Sector":"ETF","Price":42.18,"Expected_Return":9.29,"Risk":0.211,"Liquidity":0.98,"ESG_Score":52,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.84,"Beta":0.99,"Bull_Return_Adjustment":11.15,"Bear_Return_Adjustment":4.65,"Volatility_Shock":0.274},{"Asset_Name":"iShares 20Y Treasury","Sector":"Bonds","Price":95.18,"Expected_Return":3.73,"Risk":0.102,"Liquidity":0.98,"ESG_Score":77,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.7,"Beta":0.08,"Bull_Return_Adjustment":4.04,"Bear_Return_Adjustment":2.64,"Volatility_Shock":0.086},{"Asset_Name":"Vanguard Total Bond","Sector":"Bonds","Price":72.45,"Expected_Return":4.39,"Risk":0.078,"Liquidity":0.99,"ESG_Score":77,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.68,"Beta":0.08,"Bull_Return_Adjustment":4.87,"Bear_Return_Adjustment":2.93,"Volatility_Shock":0.101},{"Asset_Name":"iShares HY Corp Bond","Sector":"Bonds","Price":75.9,"Expected_Return":5.97,"Risk":0.134,"Liquidity":0.94,"ESG_Score":49,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.89,"Beta":0.37,"Bull_Return_Adjustment":6.65,"Bear_Return_Adjustment":3.32,"Volatility_Shock":0.174},{"Asset_Name":"PIMCO Active Bond","Sector":"Bonds","Price":97.0,"Expected_Return":4.48,"Risk":0.083,"Liquidity":0.94,"ESG_Score":72,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.44,"Beta":0.14,"Bull_Return_Adjustment":4.97,"Bear_Return_Adjustment":2.98,"Volatility_Shock":0.108},{"Asset_Name":"Infosys Ltd","Sector":"Technology","Price":1536.4,"Expected_Return":12.66,"Risk":0.216,"Liquidity":0.94,"ESG_Score":73,"Market_Cap":"Large","Region":"India","Dividend_Yield":2.35,"Beta":0.76,"Bull_Return_Adjustment":15.19,"Bear_Return_Adjustment":6.33,"Volatility_Shock":0.28},{"Asset_Name":"Tata Consultancy Svc","Sector":"Technology","Price":3412.8,"Expected_Return":11.96,"Risk":0.202,"Liquidity":0.94,"ESG_Score":78,"Market_Cap":"Large","Region":"India","Dividend_Yield":1.46,"Beta":0.71,"Bull_Return_Adjustment":14.35,"Bear_Return_Adjustment":5.98,"Volatility_Shock":0.263},{"Asset_Name":"Wipro Ltd","Sector":"Technology","Price":462.3,"Expected_Return":9.99,"Risk":0.255,"Liquidity":0.9,"ESG_Score":71,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.22,"Beta":0.83,"Bull_Return_Adjustment":11.99,"Bear_Return_Adjustment":5.0,"Volatility_Shock":0.332},{"Asset_Name":"HCL Technologies","Sector":"Technology","Price":1245.6,"Expected_Return":12.49,"Risk":0.237,"Liquidity":0.89,"ESG_Score":69,"Market_Cap":"Large","Region":"India","Dividend_Yield":3.61,"Beta":0.77,"Bull_Return_Adjustment":14.99,"Bear_Return_Adjustment":6.25,"Volatility_Shock":0.308},{"Asset_Name":"Tech Mahindra","Sector":"Technology","Price":1187.5,"Expected_Return":13.47,"Risk":0.258,"Liquidity":0.86,"ESG_Score":66,"Market_Cap":"Mid","Region":"India","Dividend_Yield":2.53,"Beta":0.92,"Bull_Return_Adjustment":16.16,"Bear_Return_Adjustment":6.74,"Volatility_Shock":0.335},{"Asset_Name":"Persistent Systems","Sector":"Technology","Price":4278.2,"Expected_Return":18.93,"Risk":0.32,"Liquidity":0.83,"ESG_Score":64,"Market_Cap":"Mid","Region":"India","Dividend_Yield":0.28,"Beta":1.08,"Bull_Return_Adjustment":24.61,"Bear_Return_Adjustment":9.47,"Volatility_Shock":0.416},{"Asset_Name":"Mphasis Ltd","Sector":"Technology","Price":2134.6,"Expected_Return":14.03,"Risk":0.291,"Liquidity":0.8,"ESG_Score":62,"Market_Cap":"Mid","Region":"India","Dividend_Yield":1.31,"Beta":1.0,"Bull_Return_Adjustment":16.84,"Bear_Return_Adjustment":7.02,"Volatility_Shock":0.378},{"Asset_Name":"HDFC Bank","Sector":"Finance","Price":1605.4,"Expected_Return":13.47,"Risk":0.217,"Liquidity":0.95,"ESG_Score":74,"Market_Cap":"Large","Region":"India","Dividend_Yield":1.18,"Beta":0.87,"Bull_Return_Adjustment":16.16,"Bear_Return_Adjustment":6.74,"Volatility_Shock":0.282},{"Asset_Name":"ICICI Bank","Sector":"Finance","Price":952.7,"Expected_Return":14.03,"Risk":0.204,"Liquidity":0.95,"ESG_Score":65,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.84,"Beta":0.9,"Bull_Return_Adjustment":16.84,"Bear_Return_Adjustment":7.02,"Volatility_Shock":0.265},{"Asset_Name":"State Bank of India","Sector":"Finance","Price":601.45,"Expected_Return":11.77,"Risk":0.279,"Liquidity":0.92,"ESG_Score":64,"Market_Cap":"Large","Region":"India","Dividend_Yield":1.83,"Beta":1.01,"Bull_Return_Adjustment":14.12,"Bear_Return_Adjustment":5.89,"Volatility_Shock":0.363},{"Asset_Name":"Bajaj Finance","Sector":"Finance","Price":6972.0,"Expected_Return":18.63,"Risk":0.315,"Liquidity":0.88,"ESG_Score":66,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.29,"Beta":1.11,"Bull_Return_Adjustment":22.36,"Bear_Return_Adjustment":9.32,"Volatility_Shock":0.41},{"Asset_Name":"Kotak Mahindra Bank","Sector":"Finance","Price":1785.3,"Expected_Return":12.73,"Risk":0.204,"Liquidity":0.91,"ESG_Score":73,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.06,"Beta":0.85,"Bull_Return_Adjustment":15.28,"Bear_Return_Adjustment":6.37,"Volatility_Shock":0.265},{"Asset_Name":"Axis Bank","Sector":"Finance","Price":1021.5,"Expected_Return":12.86,"Risk":0.237,"Liquidity":0.9,"ESG_Score":60,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.1,"Beta":1.01,"Bull_Return_Adjustment":15.43,"Bear_Return_Adjustment":6.43,"Volatility_Shock":0.308},{"Asset_Name":"Reliance Industries","Sector":"Energy","Price":2456.8,"Expected_Return":13.24,"Risk":0.237,"Liquidity":0.94,"ESG_Score":62,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.33,"Beta":0.88,"Bull_Return_Adjustment":15.89,"Bear_Return_Adjustment":6.62,"Volatility_Shock":0.308},{"Asset_Name":"ONGC Ltd","Sector":"Energy","Price":178.6,"Expected_Return":8.55,"Risk":0.233,"Liquidity":0.92,"ESG_Score":53,"Market_Cap":"Large","Region":"India","Dividend_Yield":5.04,"Beta":1.1,"Bull_Return_Adjustment":10.26,"Bear_Return_Adjustment":4.28,"Volatility_Shock":0.302},{"Asset_Name":"NTPC Ltd","Sector":"Utilities","Price":234.5,"Expected_Return":8.35,"Risk":0.144,"Liquidity":0.88,"ESG_Score":64,"Market_Cap":"Large","Region":"India","Dividend_Yield":2.13,"Beta":0.7,"Bull_Return_Adjustment":10.02,"Bear_Return_Adjustment":4.18,"Volatility_Shock":0.188},{"Asset_Name":"Power Grid Corp","Sector":"Utilities","Price":225.6,"Expected_Return":7.74,"Risk":0.122,"Liquidity":0.87,"ESG_Score":68,"Market_Cap":"Large","Region":"India","Dividend_Yield":3.12,"Beta":0.59,"Bull_Return_Adjustment":9.29,"Bear_Return_Adjustment":3.87,"Volatility_Shock":0.159},{"Asset_Name":"Tata Power","Sector":"Utilities","Price":258.7,"Expected_Return":10.76,"Risk":0.261,"Liquidity":0.84,"ESG_Score":68,"Market_Cap":"Mid","Region":"India","Dividend_Yield":0.77,"Beta":0.99,"Bull_Return_Adjustment":12.91,"Bear_Return_Adjustment":5.38,"Volatility_Shock":0.339},{"Asset_Name":"Asian Paints","Sector":"Consumer","Price":3145.6,"Expected_Return":12.3,"Risk":0.21,"Liquidity":0.89,"ESG_Score":70,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.95,"Beta":0.76,"Bull_Return_Adjustment":14.76,"Bear_Return_Adjustment":6.15,"Volatility_Shock":0.273},{"Asset_Name":"Hindustan Unilever","Sector":"Consumer","Price":2512.4,"Expected_Return":9.91,"Risk":0.168,"Liquidity":0.94,"ESG_Score":79,"Market_Cap":"Large","Region":"India","Dividend_Yield":1.62,"Beta":0.63,"Bull_Return_Adjustment":11.89,"Bear_Return_Adjustment":4.96,"Volatility_Shock":0.218},{"Asset_Name":"Nestle India","Sector":"Consumer","Price":22456.8,"Expected_Return":10.36,"Risk":0.149,"Liquidity":0.9,"ESG_Score":81,"Market_Cap":"Large","Region":"India","Dividend_Yield":1.42,"Beta":0.61,"Bull_Return_Adjustment":12.43,"Bear_Return_Adjustment":5.18,"Volatility_Shock":0.194},{"Asset_Name":"Maruti Suzuki","Sector":"Consumer","Price":10234.5,"Expected_Return":13.67,"Risk":0.227,"Liquidity":0.89,"ESG_Score":68,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.78,"Beta":0.87,"Bull_Return_Adjustment":16.4,"Bear_Return_Adjustment":6.84,"Volatility_Shock":0.295},{"Asset_Name":"Titan Company","Sector":"Consumer","Price":3278.9,"Expected_Return":16.33,"Risk":0.264,"Liquidity":0.87,"ESG_Score":72,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.31,"Beta":0.96,"Bull_Return_Adjustment":19.6,"Bear_Return_Adjustment":8.17,"Volatility_Shock":0.343},{"Asset_Name":"ASML Holding NV","Sector":"Technology","Price":680.42,"Expected_Return":16.3,"Risk":0.26,"Liquidity":0.9,"ESG_Score":83,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":0.98,"Beta":1.05,"Bull_Return_Adjustment":20.34,"Bear_Return_Adjustment":8.15,"Volatility_Shock":0.338},{"Asset_Name":"SAP SE","Sector":"Technology","Price":143.5,"Expected_Return":11.15,"Risk":0.197,"Liquidity":0.88,"ESG_Score":80,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.27,"Beta":0.86,"Bull_Return_Adjustment":13.38,"Bear_Return_Adjustment":5.58,"Volatility_Shock":0.256},{"Asset_Name":"Capgemini SE","Sector":"Technology","Price":187.28,"Expected_Return":12.36,"Risk":0.239,"Liquidity":0.86,"ESG_Score":80,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.6,"Beta":0.87,"Bull_Return_Adjustment":14.83,"Bear_Return_Adjustment":6.18,"Volatility_Shock":0.311},{"Asset_Name":"Siemens AG","Sector":"Technology","Price":152.34,"Expected_Return":10.94,"Risk":0.204,"Liquidity":0.87,"ESG_Score":85,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":2.04,"Beta":0.97,"Bull_Return_Adjustment":13.13,"Bear_Return_Adjustment":5.47,"Volatility_Shock":0.265},{"Asset_Name":"Ericsson AB","Sector":"Technology","Price":6.12,"Expected_Return":8.11,"Risk":0.269,"Liquidity":0.87,"ESG_Score":75,"Market_Cap":"Mid","Region":"Europe","Dividend_Yield":1.63,"Beta":0.8,"Bull_Return_Adjustment":9.73,"Bear_Return_Adjustment":4.06,"Volatility_Shock":0.349},{"Asset_Name":"HSBC Holdings","Sector":"Finance","Price":6.39,"Expected_Return":8.66,"Risk":0.221,"Liquidity":0.9,"ESG_Score":58,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":6.26,"Beta":1.09,"Bull_Return_Adjustment":10.39,"Bear_Return_Adjustment":4.33,"Volatility_Shock":0.287},{"Asset_Name":"BNP Paribas","Sector":"Finance","Price":58.74,"Expected_Return":9.11,"Risk":0.243,"Liquidity":0.9,"ESG_Score":61,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":6.56,"Beta":1.11,"Bull_Return_Adjustment":10.93,"Bear_Return_Adjustment":4.56,"Volatility_Shock":0.316},{"Asset_Name":"Allianz SE","Sector":"Finance","Price":226.4,"Expected_Return":9.57,"Risk":0.181,"Liquidity":0.88,"ESG_Score":69,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":5.09,"Beta":0.82,"Bull_Return_Adjustment":11.48,"Bear_Return_Adjustment":4.79,"Volatility_Shock":0.235},{"Asset_Name":"AXA SA","Sector":"Finance","Price":28.14,"Expected_Return":8.37,"Risk":0.183,"Liquidity":0.87,"ESG_Score":67,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":5.78,"Beta":0.89,"Bull_Return_Adjustment":10.04,"Bear_Return_Adjustment":4.19,"Volatility_Shock":0.238},{"Asset_Name":"Deutsche Bank","Sector":"Finance","Price":11.84,"Expected_Return":7.29,"Risk":0.3,"Liquidity":0.86,"ESG_Score":53,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":2.03,"Beta":1.39,"Bull_Return_Adjustment":8.75,"Bear_Return_Adjustment":3.65,"Volatility_Shock":0.39},{"Asset_Name":"ING Group","Sector":"Finance","Price":13.5,"Expected_Return":8.95,"Risk":0.229,"Liquidity":0.87,"ESG_Score":64,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":7.41,"Beta":1.12,"Bull_Return_Adjustment":10.74,"Bear_Return_Adjustment":4.48,"Volatility_Shock":0.298},{"Asset_Name":"Novo Nordisk","Sector":"Healthcare","Price":98.42,"Expected_Return":22.69,"Risk":0.219,"Liquidity":0.9,"ESG_Score":81,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.08,"Beta":0.48,"Bull_Return_Adjustment":27.23,"Bear_Return_Adjustment":11.35,"Volatility_Shock":0.285},{"Asset_Name":"Roche Holding","Sector":"Healthcare","Price":267.14,"Expected_Return":8.56,"Risk":0.153,"Liquidity":0.88,"ESG_Score":85,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":3.57,"Beta":0.52,"Bull_Return_Adjustment":10.27,"Bear_Return_Adjustment":4.28,"Volatility_Shock":0.199},{"Asset_Name":"Novartis AG","Sector":"Healthcare","Price":90.9,"Expected_Return":8.01,"Risk":0.144,"Liquidity":0.9,"ESG_Score":80,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":3.74,"Beta":0.45,"Bull_Return_Adjustment":9.61,"Bear_Return_Adjustment":4.01,"Volatility_Shock":0.187},{"Asset_Name":"AstraZeneca PLC","Sector":"Healthcare","Price":63.74,"Expected_Return":13.57,"Risk":0.212,"Liquidity":0.92,"ESG_Score":83,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.98,"Beta":0.56,"Bull_Return_Adjustment":16.28,"Bear_Return_Adjustment":6.79,"Volatility_Shock":0.276},{"Asset_Name":"Bayer AG","Sector":"Healthcare","Price":33.84,"Expected_Return":6.27,"Risk":0.227,"Liquidity":0.88,"ESG_Score":67,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":3.55,"Beta":0.71,"Bull_Return_Adjustment":7.52,"Bear_Return_Adjustment":3.14,"Volatility_Shock":0.295},{"Asset_Name":"Sanofi SA","Sector":"Healthcare","Price":93.15,"Expected_Return":8.04,"Risk":0.199,"Liquidity":0.86,"ESG_Score":77,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":3.76,"Beta":0.54,"Bull_Return_Adjustment":9.65,"Bear_Return_Adjustment":4.02,"Volatility_Shock":0.259},{"Asset_Name":"LVMH Moet Hennessy","Sector":"Consumer","Price":750.8,"Expected_Return":14.57,"Risk":0.223,"Liquidity":0.88,"ESG_Score":70,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.8,"Beta":1.0,"Bull_Return_Adjustment":17.48,"Bear_Return_Adjustment":7.29,"Volatility_Shock":0.29},{"Asset_Name":"Nestle SA","Sector":"Consumer","Price":97.7,"Expected_Return":7.91,"Risk":0.119,"Liquidity":0.91,"ESG_Score":79,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":3.06,"Beta":0.56,"Bull_Return_Adjustment":9.49,"Bear_Return_Adjustment":3.96,"Volatility_Shock":0.155},{"Asset_Name":"Unilever PLC","Sector":"Consumer","Price":43.38,"Expected_Return":7.4,"Risk":0.144,"Liquidity":0.88,"ESG_Score":81,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":3.69,"Beta":0.61,"Bull_Return_Adjustment":8.88,"Bear_Return_Adjustment":3.7,"Volatility_Shock":0.187},{"Asset_Name":"Airbus SE","Sector":"Consumer","Price":141.06,"Expected_Return":12.43,"Risk":0.225,"Liquidity":0.88,"ESG_Score":70,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.24,"Beta":1.15,"Bull_Return_Adjustment":14.92,"Bear_Return_Adjustment":6.22,"Volatility_Shock":0.293},{"Asset_Name":"Volkswagen AG","Sector":"Consumer","Price":117.06,"Expected_Return":6.52,"Risk":0.277,"Liquidity":0.88,"ESG_Score":63,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":8.49,"Beta":0.94,"Bull_Return_Adjustment":7.82,"Bear_Return_Adjustment":3.26,"Volatility_Shock":0.36},{"Asset_Name":"L'Oreal SA","Sector":"Consumer","Price":381.3,"Expected_Return":11.17,"Risk":0.198,"Liquidity":0.89,"ESG_Score":86,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.82,"Beta":0.68,"Bull_Return_Adjustment":13.4,"Bear_Return_Adjustment":5.59,"Volatility_Shock":0.257},{"Asset_Name":"TotalEnergies SE","Sector":"Energy","Price":58.52,"Expected_Return":9.4,"Risk":0.212,"Liquidity":0.9,"ESG_Score":57,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":5.24,"Beta":0.81,"Bull_Return_Adjustment":11.28,"Bear_Return_Adjustment":4.7,"Volatility_Shock":0.276},{"Asset_Name":"Shell PLC","Sector":"Energy","Price":29.77,"Expected_Return":8.65,"Risk":0.238,"Liquidity":0.93,"ESG_Score":52,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":4.23,"Beta":0.84,"Bull_Return_Adjustment":10.38,"Bear_Return_Adjustment":4.33,"Volatility_Shock":0.309},{"Asset_Name":"BP PLC","Sector":"Energy","Price":5.07,"Expected_Return":7.68,"Risk":0.251,"Liquidity":0.9,"ESG_Score":53,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":4.93,"Beta":0.86,"Bull_Return_Adjustment":9.22,"Bear_Return_Adjustment":3.84,"Volatility_Shock":0.326},{"Asset_Name":"Vestas Wind Systems","Sector":"Energy","Price":155.2,"Expected_Return":13.32,"Risk":0.359,"Liquidity":0.82,"ESG_Score":90,"Market_Cap":"Mid","Region":"Europe","Dividend_Yield":0.64,"Beta":1.31,"Bull_Return_Adjustment":15.98,"Bear_Return_Adjustment":6.66,"Volatility_Shock":0.467},{"Asset_Name":"Samsung Electronics","Sector":"Technology","Price":71200.0,"Expected_Return":12.31,"Risk":0.258,"Liquidity":0.88,"ESG_Score":73,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":2.2,"Beta":0.93,"Bull_Return_Adjustment":14.77,"Bear_Return_Adjustment":6.16,"Volatility_Shock":0.335},{"Asset_Name":"Taiwan Semiconductor","Sector":"Technology","Price":97.68,"Expected_Return":16.95,"Risk":0.29,"Liquidity":0.88,"ESG_Score":78,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":1.86,"Beta":1.02,"Bull_Return_Adjustment":20.34,"Bear_Return_Adjustment":8.48,"Volatility_Shock":0.377},{"Asset_Name":"Sony Group Corp","Sector":"Technology","Price":12420.0,"Expected_Return":10.84,"Risk":0.259,"Liquidity":0.86,"ESG_Score":74,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":0.54,"Beta":0.85,"Bull_Return_Adjustment":13.01,"Bear_Return_Adjustment":5.42,"Volatility_Shock":0.337},{"Asset_Name":"Alibaba Group","Sector":"Technology","Price":87.84,"Expected_Return":12.28,"Risk":0.356,"Liquidity":0.87,"ESG_Score":56,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":0.0,"Beta":1.26,"Bull_Return_Adjustment":14.74,"Bear_Return_Adjustment":6.14,"Volatility_Shock":0.463},{"Asset_Name":"Tencent Holdings","Sector":"Technology","Price":356.6,"Expected_Return":13.85,"Risk":0.339,"Liquidity":0.88,"ESG_Score":56,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":0.79,"Beta":1.16,"Bull_Return_Adjustment":16.62,"Bear_Return_Adjustment":6.93,"Volatility_Shock":0.441},{"Asset_Name":"Baidu Inc","Sector":"Technology","Price":112.4,"Expected_Return":11.6,"Risk":0.398,"Liquidity":0.84,"ESG_Score":52,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":0.0,"Beta":1.26,"Bull_Return_Adjustment":13.92,"Bear_Return_Adjustment":5.8,"Volatility_Shock":0.517},{"Asset_Name":"SK Hynix","Sector":"Technology","Price":134000.0,"Expected_Return":14.09,"Risk":0.347,"Liquidity":0.82,"ESG_Score":62,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":1.49,"Beta":1.12,"Bull_Return_Adjustment":16.91,"Bear_Return_Adjustment":7.05,"Volatility_Shock":0.451},{"Asset_Name":"Keyence Corp","Sector":"Technology","Price":65400.0,"Expected_Return":13.38,"Risk":0.254,"Liquidity":0.83,"ESG_Score":75,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":0.41,"Beta":0.94,"Bull_Return_Adjustment":16.06,"Bear_Return_Adjustment":6.69,"Volatility_Shock":0.331},{"Asset_Name":"ICBC China","Sector":"Finance","Price":5.63,"Expected_Return":8.15,"Risk":0.207,"Liquidity":0.89,"ESG_Score":56,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":6.23,"Beta":0.82,"Bull_Return_Adjustment":9.78,"Bear_Return_Adjustment":4.08,"Volatility_Shock":0.269},{"Asset_Name":"China Construction Bank","Sector":"Finance","Price":5.92,"Expected_Return":8.14,"Risk":0.211,"Liquidity":0.88,"ESG_Score":55,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":6.76,"Beta":0.79,"Bull_Return_Adjustment":9.77,"Bear_Return_Adjustment":4.07,"Volatility_Shock":0.274},{"Asset_Name":"Mitsubishi UFJ","Sector":"Finance","Price":1056.0,"Expected_Return":8.98,"Risk":0.203,"Liquidity":0.88,"ESG_Score":65,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":3.41,"Beta":0.87,"Bull_Return_Adjustment":10.78,"Bear_Return_Adjustment":4.49,"Volatility_Shock":0.264},{"Asset_Name":"DBS Group Holdings","Sector":"Finance","Price":33.56,"Expected_Return":10.14,"Risk":0.17,"Liquidity":0.9,"ESG_Score":75,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":5.37,"Beta":0.86,"Bull_Return_Adjustment":12.17,"Bear_Return_Adjustment":5.07,"Volatility_Shock":0.221},{"Asset_Name":"KB Financial Group","Sector":"Finance","Price":63200.0,"Expected_Return":9.16,"Risk":0.218,"Liquidity":0.86,"ESG_Score":68,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":5.87,"Beta":0.96,"Bull_Return_Adjustment":10.99,"Bear_Return_Adjustment":4.58,"Volatility_Shock":0.283},{"Asset_Name":"Toyota Motor Corp","Sector":"Consumer","Price":2780.0,"Expected_Return":8.55,"Risk":0.18,"Liquidity":0.91,"ESG_Score":71,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":2.52,"Beta":0.67,"Bull_Return_Adjustment":10.26,"Bear_Return_Adjustment":4.28,"Volatility_Shock":0.234},{"Asset_Name":"Honda Motor Co","Sector":"Consumer","Price":1492.5,"Expected_Return":8.14,"Risk":0.191,"Liquidity":0.91,"ESG_Score":72,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":3.09,"Beta":0.81,"Bull_Return_Adjustment":9.77,"Bear_Return_Adjustment":4.07,"Volatility_Shock":0.248},{"Asset_Name":"Meituan","Sector":"Consumer","Price":137.5,"Expected_Return":14.22,"Risk":0.366,"Liquidity":0.88,"ESG_Score":53,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":0.0,"Beta":1.24,"Bull_Return_Adjustment":17.06,"Bear_Return_Adjustment":7.11,"Volatility_Shock":0.476},{"Asset_Name":"JD.com Inc","Sector":"Consumer","Price":27.21,"Expected_Return":12.29,"Risk":0.358,"Liquidity":0.83,"ESG_Score":55,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":0.0,"Beta":1.17,"Bull_Return_Adjustment":14.75,"Bear_Return_Adjustment":6.15,"Volatility_Shock":0.465},{"Asset_Name":"Sea Limited","Sector":"Consumer","Price":45.69,"Expected_Return":18.61,"Risk":0.47,"Liquidity":0.8,"ESG_Score":52,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":0.0,"Beta":1.55,"Bull_Return_Adjustment":22.33,"Bear_Return_Adjustment":9.31,"Volatility_Shock":0.611},{"Asset_Name":"PetroChina Co","Sector":"Energy","Price":7.98,"Expected_Return":7.51,"Risk":0.221,"Liquidity":0.88,"ESG_Score":43,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":7.52,"Beta":0.93,"Bull_Return_Adjustment":9.01,"Bear_Return_Adjustment":3.76,"Volatility_Shock":0.287},{"Asset_Name":"Sinopec Corp","Sector":"Energy","Price":5.24,"Expected_Return":7.43,"Risk":0.245,"Liquidity":0.88,"ESG_Score":46,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":7.81,"Beta":0.81,"Bull_Return_Adjustment":8.92,"Bear_Return_Adjustment":3.72,"Volatility_Shock":0.319},{"Asset_Name":"Woodside Energy","Sector":"Energy","Price":29.85,"Expected_Return":9.68,"Risk":0.279,"Liquidity":0.86,"ESG_Score":54,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":7.71,"Beta":0.91,"Bull_Return_Adjustment":11.62,"Bear_Return_Adjustment":4.84,"Volatility_Shock":0.363},{"Asset_Name":"WEG SA Brazil","Sector":"Industrials","Price":37.48,"Expected_Return":15.2,"Risk":0.322,"Liquidity":0.74,"ESG_Score":67,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":1.07,"Beta":1.25,"Bull_Return_Adjustment":18.24,"Bear_Return_Adjustment":7.6,"Volatility_Shock":0.419},{"Asset_Name":"Ambev SA","Sector":"Consumer","Price":2.78,"Expected_Return":9.86,"Risk":0.202,"Liquidity":0.77,"ESG_Score":64,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":6.47,"Beta":0.77,"Bull_Return_Adjustment":11.83,"Bear_Return_Adjustment":4.93,"Volatility_Shock":0.263},{"Asset_Name":"Magazine Luiza","Sector":"Consumer","Price":2.8,"Expected_Return":18.97,"Risk":0.58,"Liquidity":0.62,"ESG_Score":55,"Market_Cap":"Small","Region":"Asia","Dividend_Yield":0.0,"Beta":1.65,"Bull_Return_Adjustment":22.76,"Bear_Return_Adjustment":9.49,"Volatility_Shock":0.754},{"Asset_Name":"Grab Holdings","Sector":"Technology","Price":3.42,"Expected_Return":20.55,"Risk":0.543,"Liquidity":0.63,"ESG_Score":60,"Market_Cap":"Small","Region":"Asia","Dividend_Yield":0.0,"Beta":1.54,"Bull_Return_Adjustment":24.66,"Bear_Return_Adjustment":10.28,"Volatility_Shock":0.706},{"Asset_Name":"Gojek Tokopedia","Sector":"Technology","Price":4.82,"Expected_Return":22.91,"Risk":0.585,"Liquidity":0.6,"ESG_Score":58,"Market_Cap":"Small","Region":"Asia","Dividend_Yield":0.0,"Beta":1.66,"Bull_Return_Adjustment":27.49,"Bear_Return_Adjustment":11.46,"Volatility_Shock":0.761},{"Asset_Name":"Sea Ltd Singapore","Sector":"Technology","Price":45.69,"Expected_Return":19.95,"Risk":0.486,"Liquidity":0.66,"ESG_Score":58,"Market_Cap":"Small","Region":"Asia","Dividend_Yield":0.0,"Beta":1.54,"Bull_Return_Adjustment":23.94,"Bear_Return_Adjustment":9.98,"Volatility_Shock":0.632},{"Asset_Name":"Kaspi.kz","Sector":"Finance","Price":87.5,"Expected_Return":18.15,"Risk":0.378,"Liquidity":0.61,"ESG_Score":60,"Market_Cap":"Mid","Region":"Asia","Dividend_Yield":5.0,"Beta":1.26,"Bull_Return_Adjustment":21.78,"Bear_Return_Adjustment":9.08,"Volatility_Shock":0.491},{"Asset_Name":"BHP Group Ltd","Sector":"Materials","Price":42.72,"Expected_Return":8.61,"Risk":0.269,"Liquidity":0.9,"ESG_Score":58,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":5.68,"Beta":1.08,"Bull_Return_Adjustment":10.33,"Bear_Return_Adjustment":4.31,"Volatility_Shock":0.35},{"Asset_Name":"Rio Tinto PLC","Sector":"Materials","Price":58.34,"Expected_Return":9.69,"Risk":0.26,"Liquidity":0.89,"ESG_Score":58,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":7.78,"Beta":1.08,"Bull_Return_Adjustment":11.63,"Bear_Return_Adjustment":4.85,"Volatility_Shock":0.338},{"Asset_Name":"Glencore PLC","Sector":"Materials","Price":4.97,"Expected_Return":10.85,"Risk":0.273,"Liquidity":0.86,"ESG_Score":45,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":4.83,"Beta":1.13,"Bull_Return_Adjustment":13.02,"Bear_Return_Adjustment":5.43,"Volatility_Shock":0.355},{"Asset_Name":"Newmont Corp","Sector":"Materials","Price":41.85,"Expected_Return":8.17,"Risk":0.274,"Liquidity":0.86,"ESG_Score":66,"Market_Cap":"Large","Region":"US","Dividend_Yield":3.58,"Beta":0.25,"Bull_Return_Adjustment":9.8,"Bear_Return_Adjustment":4.09,"Volatility_Shock":0.356},{"Asset_Name":"Freeport-McMoRan","Sector":"Materials","Price":39.26,"Expected_Return":11.98,"Risk":0.305,"Liquidity":0.88,"ESG_Score":52,"Market_Cap":"Mid","Region":"US","Dividend_Yield":1.53,"Beta":1.47,"Bull_Return_Adjustment":14.38,"Bear_Return_Adjustment":5.99,"Volatility_Shock":0.397},{"Asset_Name":"Vale SA","Sector":"Materials","Price":13.36,"Expected_Return":9.57,"Risk":0.319,"Liquidity":0.85,"ESG_Score":52,"Market_Cap":"Large","Region":"Asia","Dividend_Yield":8.24,"Beta":1.18,"Bull_Return_Adjustment":11.48,"Bear_Return_Adjustment":4.79,"Volatility_Shock":0.415},{"Asset_Name":"Southern Copper","Sector":"Materials","Price":79.12,"Expected_Return":11.27,"Risk":0.265,"Liquidity":0.84,"ESG_Score":58,"Market_Cap":"Mid","Region":"US","Dividend_Yield":4.55,"Beta":1.21,"Bull_Return_Adjustment":13.52,"Bear_Return_Adjustment":5.64,"Volatility_Shock":0.345},{"Asset_Name":"Caterpillar Inc","Sector":"Industrials","Price":285.28,"Expected_Return":10.35,"Risk":0.238,"Liquidity":0.95,"ESG_Score":65,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.77,"Beta":0.97,"Bull_Return_Adjustment":12.42,"Bear_Return_Adjustment":5.18,"Volatility_Shock":0.309},{"Asset_Name":"Deere & Company","Sector":"Industrials","Price":442.84,"Expected_Return":11.09,"Risk":0.226,"Liquidity":0.92,"ESG_Score":67,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.36,"Beta":1.07,"Bull_Return_Adjustment":13.31,"Bear_Return_Adjustment":5.55,"Volatility_Shock":0.294},{"Asset_Name":"Honeywell Intl","Sector":"Industrials","Price":200.12,"Expected_Return":9.83,"Risk":0.161,"Liquidity":0.9,"ESG_Score":74,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.2,"Beta":0.86,"Bull_Return_Adjustment":11.8,"Bear_Return_Adjustment":4.92,"Volatility_Shock":0.209},{"Asset_Name":"3M Company","Sector":"Industrials","Price":103.64,"Expected_Return":6.89,"Risk":0.202,"Liquidity":0.92,"ESG_Score":64,"Market_Cap":"Large","Region":"US","Dividend_Yield":5.79,"Beta":0.91,"Bull_Return_Adjustment":8.27,"Bear_Return_Adjustment":3.45,"Volatility_Shock":0.263},{"Asset_Name":"General Electric","Sector":"Industrials","Price":125.64,"Expected_Return":12.44,"Risk":0.239,"Liquidity":0.9,"ESG_Score":61,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.08,"Beta":1.22,"Bull_Return_Adjustment":14.93,"Bear_Return_Adjustment":6.22,"Volatility_Shock":0.311},{"Asset_Name":"ABB Ltd","Sector":"Industrials","Price":34.94,"Expected_Return":11.26,"Risk":0.201,"Liquidity":0.86,"ESG_Score":76,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":2.17,"Beta":0.9,"Bull_Return_Adjustment":13.51,"Bear_Return_Adjustment":5.63,"Volatility_Shock":0.261},{"Asset_Name":"Schneider Electric","Sector":"Industrials","Price":201.24,"Expected_Return":12.62,"Risk":0.19,"Liquidity":0.88,"ESG_Score":86,"Market_Cap":"Large","Region":"Europe","Dividend_Yield":1.86,"Beta":0.92,"Bull_Return_Adjustment":15.14,"Bear_Return_Adjustment":6.31,"Volatility_Shock":0.247},{"Asset_Name":"Siemens Energy","Sector":"Industrials","Price":19.54,"Expected_Return":10.47,"Risk":0.295,"Liquidity":0.84,"ESG_Score":77,"Market_Cap":"Mid","Region":"Europe","Dividend_Yield":0.0,"Beta":1.1,"Bull_Return_Adjustment":12.56,"Bear_Return_Adjustment":5.24,"Volatility_Shock":0.384},{"Asset_Name":"Happiest Minds Tech","Sector":"Technology","Price":812.4,"Expected_Return":18.49,"Risk":0.395,"Liquidity":0.75,"ESG_Score":68,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.62,"Beta":1.13,"Bull_Return_Adjustment":22.19,"Bear_Return_Adjustment":9.25,"Volatility_Shock":0.514},{"Asset_Name":"Tanla Platforms","Sector":"Technology","Price":1034.5,"Expected_Return":20.05,"Risk":0.402,"Liquidity":0.7,"ESG_Score":59,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.97,"Beta":1.24,"Bull_Return_Adjustment":24.06,"Bear_Return_Adjustment":10.03,"Volatility_Shock":0.523},{"Asset_Name":"Latent View Analytics","Sector":"Technology","Price":456.8,"Expected_Return":22.12,"Risk":0.469,"Liquidity":0.68,"ESG_Score":65,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.0,"Beta":1.33,"Bull_Return_Adjustment":26.54,"Bear_Return_Adjustment":11.06,"Volatility_Shock":0.61},{"Asset_Name":"RateGain Travel Tech","Sector":"Technology","Price":612.3,"Expected_Return":24.04,"Risk":0.489,"Liquidity":0.66,"ESG_Score":59,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.0,"Beta":1.39,"Bull_Return_Adjustment":28.85,"Bear_Return_Adjustment":12.02,"Volatility_Shock":0.636},{"Asset_Name":"Global Health Ltd","Sector":"Healthcare","Price":834.6,"Expected_Return":20.74,"Risk":0.352,"Liquidity":0.67,"ESG_Score":68,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.0,"Beta":1.12,"Bull_Return_Adjustment":24.89,"Bear_Return_Adjustment":10.37,"Volatility_Shock":0.458},{"Asset_Name":"Clean Science Tech","Sector":"Materials","Price":1234.5,"Expected_Return":18.11,"Risk":0.377,"Liquidity":0.65,"ESG_Score":74,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.81,"Beta":1.06,"Bull_Return_Adjustment":21.73,"Bear_Return_Adjustment":9.06,"Volatility_Shock":0.49},{"Asset_Name":"KPIT Technologies","Sector":"Technology","Price":1456.8,"Expected_Return":22.08,"Risk":0.389,"Liquidity":0.68,"ESG_Score":68,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.34,"Beta":1.23,"Bull_Return_Adjustment":26.5,"Bear_Return_Adjustment":11.04,"Volatility_Shock":0.506},{"Asset_Name":"Zomato Ltd","Sector":"Consumer","Price":132.4,"Expected_Return":22.95,"Risk":0.504,"Liquidity":0.7,"ESG_Score":54,"Market_Cap":"Mid","Region":"India","Dividend_Yield":0.0,"Beta":1.44,"Bull_Return_Adjustment":27.54,"Bear_Return_Adjustment":11.48,"Volatility_Shock":0.655},{"Asset_Name":"Paytm (One97 Comm)","Sector":"Finance","Price":724.5,"Expected_Return":18.85,"Risk":0.589,"Liquidity":0.69,"ESG_Score":46,"Market_Cap":"Mid","Region":"India","Dividend_Yield":0.0,"Beta":1.53,"Bull_Return_Adjustment":22.62,"Bear_Return_Adjustment":9.43,"Volatility_Shock":0.766},{"Asset_Name":"Nykaa (FSN Ecomm)","Sector":"Consumer","Price":178.4,"Expected_Return":20.91,"Risk":0.494,"Liquidity":0.65,"ESG_Score":55,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.0,"Beta":1.5,"Bull_Return_Adjustment":25.09,"Bear_Return_Adjustment":10.46,"Volatility_Shock":0.642},{"Asset_Name":"ARK Innovation ETF","Sector":"ETF","Price":44.87,"Expected_Return":18.28,"Risk":0.472,"Liquidity":0.96,"ESG_Score":59,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.6,"Bull_Return_Adjustment":21.94,"Bear_Return_Adjustment":9.14,"Volatility_Shock":0.614},{"Asset_Name":"Global Clean Energy ETF","Sector":"ETF","Price":14.62,"Expected_Return":12.93,"Risk":0.309,"Liquidity":0.89,"ESG_Score":89,"Market_Cap":"Mid","Region":"US","Dividend_Yield":1.37,"Beta":1.11,"Bull_Return_Adjustment":15.52,"Bear_Return_Adjustment":6.47,"Volatility_Shock":0.402},{"Asset_Name":"iShares Global REIT","Sector":"ETF","Price":41.04,"Expected_Return":7.29,"Risk":0.152,"Liquidity":0.93,"ESG_Score":63,"Market_Cap":"Large","Region":"US","Dividend_Yield":4.41,"Beta":0.87,"Bull_Return_Adjustment":8.75,"Bear_Return_Adjustment":3.65,"Volatility_Shock":0.198},{"Asset_Name":"VanEck Gold Miners","Sector":"ETF","Price":29.62,"Expected_Return":9.06,"Risk":0.291,"Liquidity":0.88,"ESG_Score":62,"Market_Cap":"Mid","Region":"US","Dividend_Yield":1.69,"Beta":0.42,"Bull_Return_Adjustment":10.87,"Bear_Return_Adjustment":4.53,"Volatility_Shock":0.379},{"Asset_Name":"iShares ESG Aware ETF","Sector":"ETF","Price":95.21,"Expected_Return":11.41,"Risk":0.169,"Liquidity":0.92,"ESG_Score":89,"Market_Cap":"Large","Region":"US","Dividend_Yield":1.49,"Beta":1.0,"Bull_Return_Adjustment":13.69,"Bear_Return_Adjustment":5.71,"Volatility_Shock":0.22},{"Asset_Name":"Vanguard ESG Intl ETF","Sector":"ETF","Price":58.74,"Expected_Return":9.48,"Risk":0.186,"Liquidity":0.93,"ESG_Score":83,"Market_Cap":"Large","Region":"US","Dividend_Yield":2.44,"Beta":0.91,"Bull_Return_Adjustment":11.38,"Bear_Return_Adjustment":4.74,"Volatility_Shock":0.242},{"Asset_Name":"Zoom Video Comm","Sector":"Technology","Price":65.84,"Expected_Return":10.72,"Risk":0.397,"Liquidity":0.9,"ESG_Score":58,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.28,"Bull_Return_Adjustment":12.86,"Bear_Return_Adjustment":5.36,"Volatility_Shock":0.516},{"Asset_Name":"Shopify Inc","Sector":"Technology","Price":65.28,"Expected_Return":18.75,"Risk":0.455,"Liquidity":0.86,"ESG_Score":59,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.39,"Bull_Return_Adjustment":22.5,"Bear_Return_Adjustment":9.38,"Volatility_Shock":0.592},{"Asset_Name":"Block Inc","Sector":"Finance","Price":60.42,"Expected_Return":16.49,"Risk":0.478,"Liquidity":0.86,"ESG_Score":58,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.45,"Bull_Return_Adjustment":19.79,"Bear_Return_Adjustment":8.25,"Volatility_Shock":0.621},{"Asset_Name":"Robinhood Markets","Sector":"Finance","Price":10.5,"Expected_Return":14.51,"Risk":0.513,"Liquidity":0.77,"ESG_Score":50,"Market_Cap":"Small","Region":"US","Dividend_Yield":0.0,"Beta":1.52,"Bull_Return_Adjustment":17.41,"Bear_Return_Adjustment":7.26,"Volatility_Shock":0.667},{"Asset_Name":"Rivian Automotive","Sector":"Consumer","Price":18.45,"Expected_Return":20.09,"Risk":0.627,"Liquidity":0.71,"ESG_Score":63,"Market_Cap":"Small","Region":"US","Dividend_Yield":0.0,"Beta":1.72,"Bull_Return_Adjustment":24.11,"Bear_Return_Adjustment":10.05,"Volatility_Shock":0.815},{"Asset_Name":"Lucid Group","Sector":"Consumer","Price":4.2,"Expected_Return":18.33,"Risk":0.653,"Liquidity":0.68,"ESG_Score":67,"Market_Cap":"Small","Region":"US","Dividend_Yield":0.0,"Beta":1.74,"Bull_Return_Adjustment":22.0,"Bear_Return_Adjustment":9.17,"Volatility_Shock":0.849},{"Asset_Name":"AppLovin Corp","Sector":"Technology","Price":87.22,"Expected_Return":22.5,"Risk":0.436,"Liquidity":0.83,"ESG_Score":54,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.46,"Bull_Return_Adjustment":27.0,"Bear_Return_Adjustment":11.25,"Volatility_Shock":0.567},{"Asset_Name":"Celsius Holdings","Sector":"Consumer","Price":58.62,"Expected_Return":19.95,"Risk":0.52,"Liquidity":0.77,"ESG_Score":62,"Market_Cap":"Small","Region":"US","Dividend_Yield":0.0,"Beta":1.48,"Bull_Return_Adjustment":23.94,"Bear_Return_Adjustment":9.98,"Volatility_Shock":0.676},{"Asset_Name":"Monday.com","Sector":"Technology","Price":184.22,"Expected_Return":17.75,"Risk":0.415,"Liquidity":0.78,"ESG_Score":65,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.34,"Bull_Return_Adjustment":21.3,"Bear_Return_Adjustment":8.88,"Volatility_Shock":0.54},{"Asset_Name":"UiPath Inc","Sector":"Technology","Price":20.2,"Expected_Return":15.54,"Risk":0.437,"Liquidity":0.79,"ESG_Score":62,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.29,"Bull_Return_Adjustment":18.65,"Bear_Return_Adjustment":7.77,"Volatility_Shock":0.568},{"Asset_Name":"CrowdStrike Holdings","Sector":"Technology","Price":206.56,"Expected_Return":22.51,"Risk":0.378,"Liquidity":0.81,"ESG_Score":66,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.36,"Bull_Return_Adjustment":27.01,"Bear_Return_Adjustment":11.26,"Volatility_Shock":0.491},{"Asset_Name":"Zscaler Inc","Sector":"Technology","Price":175.74,"Expected_Return":20.42,"Risk":0.408,"Liquidity":0.81,"ESG_Score":61,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.36,"Bull_Return_Adjustment":24.5,"Bear_Return_Adjustment":10.21,"Volatility_Shock":0.531},{"Asset_Name":"SentinelOne","Sector":"Technology","Price":19.6,"Expected_Return":18.98,"Risk":0.486,"Liquidity":0.76,"ESG_Score":60,"Market_Cap":"Small","Region":"US","Dividend_Yield":0.0,"Beta":1.46,"Bull_Return_Adjustment":22.78,"Bear_Return_Adjustment":9.49,"Volatility_Shock":0.632},{"Asset_Name":"Fortinet Inc","Sector":"Technology","Price":64.62,"Expected_Return":14.86,"Risk":0.285,"Liquidity":0.87,"ESG_Score":68,"Market_Cap":"Mid","Region":"US","Dividend_Yield":0.0,"Beta":1.2,"Bull_Return_Adjustment":17.83,"Bear_Return_Adjustment":7.43,"Volatility_Shock":0.371},{"Asset_Name":"Palo Alto Networks","Sector":"Technology","Price":307.56,"Expected_Return":18.54,"Risk":0.301,"Liquidity":0.87,"ESG_Score":65,"Market_Cap":"Large","Region":"US","Dividend_Yield":0.0,"Beta":1.12,"Bull_Return_Adjustment":22.25,"Bear_Return_Adjustment":9.27,"Volatility_Shock":0.391},{"Asset_Name":"Bajaj Auto","Sector":"Consumer","Price":8742.3,"Expected_Return":12.61,"Risk":0.237,"Liquidity":0.89,"ESG_Score":64,"Market_Cap":"Large","Region":"India","Dividend_Yield":1.03,"Beta":0.81,"Bull_Return_Adjustment":15.13,"Bear_Return_Adjustment":6.31,"Volatility_Shock":0.308},{"Asset_Name":"Sun Pharma","Sector":"Healthcare","Price":1123.4,"Expected_Return":12.24,"Risk":0.216,"Liquidity":0.87,"ESG_Score":66,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.89,"Beta":0.75,"Bull_Return_Adjustment":14.69,"Bear_Return_Adjustment":6.12,"Volatility_Shock":0.281},{"Asset_Name":"Dr Reddy Labs","Sector":"Healthcare","Price":5234.6,"Expected_Return":11.58,"Risk":0.203,"Liquidity":0.88,"ESG_Score":73,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.57,"Beta":0.63,"Bull_Return_Adjustment":13.9,"Bear_Return_Adjustment":5.79,"Volatility_Shock":0.264},{"Asset_Name":"Cipla Ltd","Sector":"Healthcare","Price":1178.9,"Expected_Return":10.06,"Risk":0.218,"Liquidity":0.88,"ESG_Score":70,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.42,"Beta":0.67,"Bull_Return_Adjustment":12.07,"Bear_Return_Adjustment":5.03,"Volatility_Shock":0.283},{"Asset_Name":"Adani Ports","Sector":"Industrials","Price":812.4,"Expected_Return":14.79,"Risk":0.273,"Liquidity":0.84,"ESG_Score":53,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.49,"Beta":1.02,"Bull_Return_Adjustment":17.75,"Bear_Return_Adjustment":7.4,"Volatility_Shock":0.355},{"Asset_Name":"Adani Green Energy","Sector":"Energy","Price":1245.6,"Expected_Return":18.14,"Risk":0.379,"Liquidity":0.76,"ESG_Score":72,"Market_Cap":"Mid","Region":"India","Dividend_Yield":0.0,"Beta":1.23,"Bull_Return_Adjustment":21.77,"Bear_Return_Adjustment":9.07,"Volatility_Shock":0.493},{"Asset_Name":"Tata Motors","Sector":"Consumer","Price":756.4,"Expected_Return":16.92,"Risk":0.334,"Liquidity":0.84,"ESG_Score":64,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.0,"Beta":1.14,"Bull_Return_Adjustment":20.3,"Bear_Return_Adjustment":8.46,"Volatility_Shock":0.434},{"Asset_Name":"Tata Steel","Sector":"Materials","Price":134.5,"Expected_Return":12.3,"Risk":0.304,"Liquidity":0.86,"ESG_Score":56,"Market_Cap":"Large","Region":"India","Dividend_Yield":2.24,"Beta":1.29,"Bull_Return_Adjustment":14.76,"Bear_Return_Adjustment":6.15,"Volatility_Shock":0.395},{"Asset_Name":"UltraTech Cement","Sector":"Materials","Price":8456.3,"Expected_Return":10.96,"Risk":0.205,"Liquidity":0.86,"ESG_Score":60,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.47,"Beta":0.9,"Bull_Return_Adjustment":13.15,"Bear_Return_Adjustment":5.48,"Volatility_Shock":0.267},{"Asset_Name":"Divi's Laboratories","Sector":"Healthcare","Price":3456.7,"Expected_Return":12.28,"Risk":0.239,"Liquidity":0.84,"ESG_Score":71,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.87,"Beta":0.72,"Bull_Return_Adjustment":14.74,"Bear_Return_Adjustment":6.14,"Volatility_Shock":0.311},{"Asset_Name":"L&T Ltd","Sector":"Industrials","Price":2867.4,"Expected_Return":13.84,"Risk":0.237,"Liquidity":0.87,"ESG_Score":68,"Market_Cap":"Large","Region":"India","Dividend_Yield":0.87,"Beta":0.99,"Bull_Return_Adjustment":16.61,"Bear_Return_Adjustment":6.92,"Volatility_Shock":0.308},{"Asset_Name":"ITC Ltd","Sector":"Consumer","Price":448.7,"Expected_Return":9.72,"Risk":0.152,"Liquidity":0.89,"ESG_Score":68,"Market_Cap":"Large","Region":"India","Dividend_Yield":3.35,"Beta":0.65,"Bull_Return_Adjustment":11.66,"Bear_Return_Adjustment":4.86,"Volatility_Shock":0.198},{"Asset_Name":"Edelweiss Financial","Sector":"Finance","Price":67.3,"Expected_Return":14.82,"Risk":0.339,"Liquidity":0.76,"ESG_Score":55,"Market_Cap":"Small","Region":"India","Dividend_Yield":1.49,"Beta":1.27,"Bull_Return_Adjustment":17.78,"Bear_Return_Adjustment":7.41,"Volatility_Shock":0.441},{"Asset_Name":"Nuvoco Vistas","Sector":"Materials","Price":345.6,"Expected_Return":11.89,"Risk":0.3,"Liquidity":0.72,"ESG_Score":59,"Market_Cap":"Small","Region":"India","Dividend_Yield":0.0,"Beta":1.01,"Bull_Return_Adjustment":14.27,"Bear_Return_Adjustment":5.95,"Volatility_Shock":0.39},{"Asset_Name":"AU Small Finance Bank","Sector":"Finance","Price":612.5,"Expected_Return":16.84,"Risk":0.289,"Liquidity":0.79,"ESG_Score":59,"Market_Cap":"Mid","Region":"India","Dividend_Yield":0.0,"Beta":1.15,"Bull_Return_Adjustment":20.21,"Bear_Return_Adjustment":8.42,"Volatility_Shock":0.376}];

// ── Palette ────────────────────────────────────────────────────────────────
const SECTOR_COLORS = {
  Technology:"#00D4FF", Healthcare:"#22C55E", Finance:"#A78BFA",
  Energy:"#F59E0B", Consumer:"#F472B6", Utilities:"#34D399",
  "Real Estate":"#60A5FA", ETF:"#FB923C", Bonds:"#94A3B8",
  Industrials:"#FBBF24", Materials:"#C084FC"
};
const REGION_COLORS = { US:"#00D4FF", India:"#F59E0B", Europe:"#A78BFA", Asia:"#22C55E" };
const CAP_COLORS = { Large:"#00D4FF", Mid:"#A78BFA", Small:"#F59E0B" };

// ── Precompute aggregates ──────────────────────────────────────────────────
const groupBy = (arr, key, agg) => {
  const m = {};
  arr.forEach(d => {
    const k = d[key];
    if (!m[k]) m[k] = [];
    m[k].push(d);
  });
  return Object.entries(m).map(([k, rows]) => ({ name: k, ...agg(rows) }));
};
const avg = (arr, f) => arr.reduce((s, d) => s + d[f], 0) / arr.length;

const sectorData = groupBy(RAW, "Sector", rows => ({
  count: rows.length,
  avg_return: +avg(rows, "Expected_Return").toFixed(2),
  avg_risk: +avg(rows, "Risk").toFixed(3),
  avg_esg: +avg(rows, "ESG_Score").toFixed(1),
  avg_dividend: +avg(rows, "Dividend_Yield").toFixed(2),
})).sort((a, b) => b.avg_return - a.avg_return);

const regionData = groupBy(RAW, "Region", rows => ({
  count: rows.length,
  avg_return: +avg(rows, "Expected_Return").toFixed(2),
  avg_risk: +avg(rows, "Risk").toFixed(3),
  avg_esg: +avg(rows, "ESG_Score").toFixed(1),
}));

const capData = groupBy(RAW, "Market_Cap", rows => ({
  count: rows.length,
  avg_return: +avg(rows, "Expected_Return").toFixed(2),
  avg_risk: +avg(rows, "Risk").toFixed(3),
})).sort((a, b) => ["Large","Mid","Small"].indexOf(a.name) - ["Large","Mid","Small"].indexOf(b.name));

const top10Return = [...RAW].sort((a,b) => b.Expected_Return - a.Expected_Return).slice(0,10);
const top10ESG = [...RAW].sort((a,b) => b.ESG_Score - a.ESG_Score).slice(0,10);
const scatterData = RAW.map(d => ({ ...d, x: +d.Risk.toFixed(3), y: +d.Expected_Return.toFixed(2), z: d.ESG_Score }));

// ── Components ────────────────────────────────────────────────────────────
const TABS = ["Overview","Risk vs Return","Sector Analysis","ESG & Ethics","Rankings","TOPSIS","Chatbot"];

const SYSTEM_PROMPT = `You are PortfolioAI, an expert financial analyst embedded inside the MAPFM Multi-Agent Portfolio Management Dashboard. You have deep knowledge of the following real dataset of 213 global assets spanning 11 sectors (Technology, Healthcare, Finance, Energy, Consumer, Utilities, Real Estate, ETF, Bonds, Industrials, Materials) and 4 regions (US, India, Europe, Asia).

Key dataset statistics:
- 213 total assets: 53 Technology, 36 Consumer, 33 Finance, 21 Healthcare, 18 Energy, 12 ETF, 11 Industrials, 11 Materials, 9 Utilities, 5 Real Estate, 4 Bonds
- Avg Expected Return: 12.36% | Avg Risk: 26.5% | Avg ESG: 65.8
- Top return: NVIDIA Corp (28.34%) | Top ESG: Vestas Wind Systems (90)
- Regions: US (103), India (48), Europe (32), Asia (30)
- 3 agents: Investor (PPO RL, maximizes Sharpe), AI Advisor (TOPSIS/WSM ranking), Regulator (ESG floor ≥65, max 25% concentration)

You can answer questions about:
- Specific assets, sectors, regions, and comparisons
- TOPSIS and WSM methodology and how rankings work
- Multi-agent RL concepts, agent roles and conflicts
- Portfolio construction, diversification, risk management
- ESG investing, ethical constraints, sustainability tradeoffs
- Bull/Bear scenario analysis

Be concise, insightful, and data-driven. Reference specific numbers from the dataset when relevant.`;

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  return <circle cx={cx} cy={cy} r={4} fill={SECTOR_COLORS[payload.Sector] || "#64748B"} fillOpacity={0.8} stroke="none" />;
};

const StatCard = ({ label, value, sub, color="#00D4FF" }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:"16px 20px", flex:1, minWidth:140 }}>
    <div style={{ fontSize:11, color:"#475569", letterSpacing:1 }}>{label.toUpperCase()}</div>
    <div style={{ fontSize:24, fontWeight:800, color, margin:"6px 0 4px" }}>{value}</div>
    <div style={{ fontSize:11, color:"#64748B" }}>{sub}</div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, padding:"10px 14px", fontSize:12 }}>
      <div style={{ fontWeight:700, color:"#E2E8F0", marginBottom:4 }}>{d.Asset_Name}</div>
      <div style={{ color:"#64748B" }}>{d.Sector} · {d.Region} · {d.Market_Cap}</div>
      <div style={{ marginTop:6, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 16px" }}>
        {[["Return",`${d.Expected_Return}%`,"#22C55E"],["Risk",`${(d.Risk*100).toFixed(1)}%`,"#EF4444"],["ESG",d.ESG_Score,"#F59E0B"],["Beta",d.Beta,"#A78BFA"]].map(([k,v,c]) => (
          <div key={k}><span style={{ color:"#475569" }}>{k}: </span><span style={{ color:c, fontWeight:600 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("Overview");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [chatMessages, setChatMessages] = useState([
    { role:"assistant", content:"👋 Hi! I'm PortfolioAI — ask me anything about the 213 assets in this dataset, sector analysis, TOPSIS methodology, agent decisions, or portfolio strategy." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // TOPSIS WSM weights (raw slider values, auto-normalised internally)
  const [tWeights, setTWeights] = useState({ Return:30, Risk:25, Liquidity:15, ESG:15, Dividend:10, Beta:5 });
  const [topsisN, setTopsisN] = useState(20);

  const TCRITERIA = [
    { key:"Expected_Return", label:"Return",    benefit:true,  wKey:"Return"   },
    { key:"Risk",            label:"Risk",       benefit:false, wKey:"Risk"     },
    { key:"Liquidity",       label:"Liquidity",  benefit:true,  wKey:"Liquidity"},
    { key:"ESG_Score",       label:"ESG",        benefit:true,  wKey:"ESG"      },
    { key:"Dividend_Yield",  label:"Dividend",   benefit:true,  wKey:"Dividend" },
    { key:"Beta",            label:"Beta",       benefit:false, wKey:"Beta"     },
  ];

  const topsisResults = useMemo(() => {
    const totalW = Object.values(tWeights).reduce((s,v) => s+v, 0) || 1;
    const weights = TCRITERIA.map(c => tWeights[c.wKey] / totalW);
    const norms = TCRITERIA.map(c => Math.sqrt(RAW.reduce((s,d) => s + d[c.key] ** 2, 0)) || 1);
    const weighted = RAW.map(d => ({
      ...d,
      wv: TCRITERIA.map((c,j) => (d[c.key] / norms[j]) * weights[j]),
    }));
    const idealBest  = TCRITERIA.map((c,j) => c.benefit ? Math.max(...weighted.map(d => d.wv[j])) : Math.min(...weighted.map(d => d.wv[j])));
    const idealWorst = TCRITERIA.map((c,j) => c.benefit ? Math.min(...weighted.map(d => d.wv[j])) : Math.max(...weighted.map(d => d.wv[j])));
    return weighted.map(d => {
      const dPlus  = Math.sqrt(d.wv.reduce((s,v,j) => s + (v - idealBest[j])  ** 2, 0));
      const dMinus = Math.sqrt(d.wv.reduce((s,v,j) => s + (v - idealWorst[j]) ** 2, 0));
      const cScore = dPlus + dMinus > 0 ? dMinus / (dPlus + dMinus) : 0;
      return { ...d, dPlus, dMinus, cScore };
    }).sort((a,b) => b.cScore - a.cScore);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tWeights]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role:"user", content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "API request failed");
      }
      const reply = data.reply || "Sorry, I couldn't process that.";
      setChatMessages(prev => [...prev, { role:"assistant", content:reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role:"assistant", content:`⚠️ Error: ${error.message}. Make sure the backend server is running on port 3001 and your ANTHROPIC_API_KEY is set.` }]);
    }
    setChatLoading(false);
  };

  const filtered = useMemo(() => RAW.filter(d =>
    (sectorFilter === "All" || d.Sector === sectorFilter) &&
    (regionFilter === "All" || d.Region === regionFilter)
  ), [sectorFilter, regionFilter]);

  const sectors = ["All", ...Object.keys(SECTOR_COLORS)];
  const regions = ["All","US","India","Europe","Asia"];

  return (
    <div style={{ minHeight:"100vh", background:"#070B14", color:"#E2E8F0", fontFamily:"'DM Mono','Fira Code',monospace", padding:24 }}>

      {/* HEADER */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#00D4FF", boxShadow:"0 0 8px #00D4FF" }} />
          <span style={{ fontSize:11, color:"#00D4FF", letterSpacing:2, fontWeight:700 }}>LIVE DATA · 213 ASSETS</span>
        </div>
        <h1 style={{ margin:"6px 0 2px", fontSize:24, fontWeight:800, color:"#F1F5F9", letterSpacing:-0.5 }}>MAPFM · Portfolio Intelligence Hub</h1>
        <p style={{ margin:0, fontSize:12, color:"#475569" }}>Multi-Region · 11 Sectors · Real Dataset Visualization</p>
      </div>

      {/* FILTERS */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#475569" }}>SECTOR</span>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} style={{ background:"#0F172A", border:"1px solid #1E293B", color:"#E2E8F0", padding:"5px 10px", borderRadius:7, fontSize:12, fontFamily:"inherit" }}>
            {sectors.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#475569" }}>REGION</span>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ background:"#0F172A", border:"1px solid #1E293B", color:"#E2E8F0", padding:"5px 10px", borderRadius:7, fontSize:12, fontFamily:"inherit" }}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ marginLeft:"auto", fontSize:12, color:"#475569", padding:"5px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:7 }}>
          Showing <span style={{ color:"#00D4FF", fontWeight:700 }}>{filtered.length}</span> assets
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <StatCard label="Total Assets" value={filtered.length} sub="In current filter" />
        <StatCard label="Avg Return" value={`${avg(filtered,"Expected_Return").toFixed(1)}%`} sub="Expected annual" color="#22C55E" />
        <StatCard label="Avg Risk" value={`${(avg(filtered,"Risk")*100).toFixed(1)}%`} sub="Portfolio volatility" color="#EF4444" />
        <StatCard label="Avg ESG" value={avg(filtered,"ESG_Score").toFixed(1)} sub="Sustainability score" color="#F59E0B" />
        <StatCard label="Avg Beta" value={avg(filtered,"Beta").toFixed(2)} sub="Market sensitivity" color="#A78BFA" />
        <StatCard label="Avg Dividend" value={`${avg(filtered,"Dividend_Yield").toFixed(1)}%`} sub="Annual yield" color="#F472B6" />
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:6, marginBottom:20, borderBottom:"1px solid #1E293B", paddingBottom:12, flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab===t?"rgba(0,212,255,0.12)":"transparent", border: tab===t?"1px solid #00D4FF44":"1px solid transparent", color: tab===t?"#00D4FF":"#64748B", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "Overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Sector Return Bar */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>AVG EXPECTED RETURN BY SECTOR</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sectorData} layout="vertical" margin={{ left:10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#475569", fontSize:10 }} tickFormatter={v=>`${v}%`} domain={[0,30]} />
                <YAxis type="category" dataKey="name" tick={{ fill:"#94A3B8", fontSize:10 }} width={80} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} formatter={v=>[`${v}%`,"Avg Return"]} />
                <Bar dataKey="avg_return" radius={[0,4,4,0]}>
                  {sectorData.map(d => <Cell key={d.name} fill={SECTOR_COLORS[d.name] || "#64748B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Region Comparison */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>REGION PROFILE (RETURN / RISK / ESG)</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={regionData.map(r => ({ subject: r.name, Return: r.avg_return, "ESG×5": r.avg_esg/20*5, "Safety": (1-r.avg_risk)*20 }))}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:"#94A3B8", fontSize:11 }} />
                <PolarRadiusAxis angle={30} domain={[0,20]} tick={{ fill:"#475569", fontSize:9 }} />
                {["Return","ESG×5","Safety"].map((k,i) => (
                  <Radar key={k} name={k} dataKey={k} stroke={["#00D4FF","#F59E0B","#22C55E"][i]} fill={["#00D4FF","#F59E0B","#22C55E"][i]} fillOpacity={0.1} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize:11, color:"#94A3B8" }} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Market Cap Distribution */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>MARKET CAP — RISK vs RETURN TRADEOFF</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={capData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fill:"#94A3B8", fontSize:11 }} />
                <YAxis tick={{ fill:"#475569", fontSize:10 }} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} />
                <Legend wrapperStyle={{ fontSize:11 }} />
                <Bar dataKey="avg_return" name="Avg Return %" fill="#00D4FF" radius={[4,4,0,0]} />
                <Bar dataKey="avg_risk" name="Avg Risk" fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Count by Sector */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>ASSET COUNT BY SECTOR</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[...sectorData].sort((a,b)=>b.count-a.count)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fill:"#94A3B8", fontSize:9 }} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fill:"#475569", fontSize:10 }} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} />
                <Bar dataKey="count" name="# Assets" radius={[4,4,0,0]}>
                  {[...sectorData].sort((a,b)=>b.count-a.count).map(d => <Cell key={d.name} fill={SECTOR_COLORS[d.name] || "#64748B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── RISK VS RETURN ── */}
      {tab === "Risk vs Return" && (
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:4, letterSpacing:1 }}>RISK vs EXPECTED RETURN — ALL ASSETS ({filtered.length})</div>
            <div style={{ fontSize:11, color:"#334155", marginBottom:16 }}>Dot color = Sector. Hover for details.</div>
            <ResponsiveContainer width="100%" height={420}>
              <ScatterChart margin={{ top:10, right:20, bottom:20, left:10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="x" type="number" name="Risk" domain={[0.05,0.7]} tick={{ fill:"#475569", fontSize:10 }} label={{ value:"Risk (σ)", position:"insideBottom", offset:-10, fill:"#475569", fontSize:11 }} tickFormatter={v=>`${(v*100).toFixed(0)}%`} />
                <YAxis dataKey="y" type="number" name="Return" domain={[0,30]} tick={{ fill:"#475569", fontSize:10 }} label={{ value:"Expected Return %", angle:-90, position:"insideLeft", fill:"#475569", fontSize:11 }} />
                <ZAxis dataKey="z" range={[30,120]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={0.265} stroke="#475569" strokeDasharray="4 4" label={{ value:"Avg Risk", fill:"#475569", fontSize:10, position:"top" }} />
                <ReferenceLine y={12.36} stroke="#475569" strokeDasharray="4 4" label={{ value:"Avg Return", fill:"#475569", fontSize:10, position:"right" }} />
                <Scatter data={filtered.map(d=>({...d,x:d.Risk,y:d.Expected_Return,z:d.ESG_Score}))} shape={<CustomDot />} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:16 }}>
              <div style={{ fontSize:11, color:"#475569", marginBottom:10, letterSpacing:1 }}>SECTOR LEGEND</div>
              {Object.entries(SECTOR_COLORS).map(([s,c]) => (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:c, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:"#94A3B8" }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:16, flex:1 }}>
              <div style={{ fontSize:11, color:"#475569", marginBottom:10, letterSpacing:1 }}>QUADRANT ANALYSIS</div>
              {[
                { label:"🟢 High Return, Low Risk", desc:"Best picks — Bonds, Healthcare stalwarts", color:"#22C55E" },
                { label:"🟡 High Return, High Risk", desc:"Growth plays — Small caps, India tech", color:"#F59E0B" },
                { label:"🔵 Low Return, Low Risk", desc:"Defensive — Utilities, Bonds", color:"#00D4FF" },
                { label:"🔴 Low Return, High Risk", desc:"Avoid — Speculative, poor ESG", color:"#EF4444" },
              ].map(q => (
                <div key={q.label} style={{ marginBottom:10, padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:6, borderLeft:`3px solid ${q.color}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:q.color }}>{q.label}</div>
                  <div style={{ fontSize:10, color:"#64748B", marginTop:2 }}>{q.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTOR ANALYSIS ── */}
      {tab === "Sector Analysis" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>SECTOR AVG RISK (Volatility σ)</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[...sectorData].sort((a,b)=>a.avg_risk-b.avg_risk)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#475569", fontSize:10 }} tickFormatter={v=>`${(v*100).toFixed(0)}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill:"#94A3B8", fontSize:10 }} width={80} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} formatter={v=>[`${(v*100).toFixed(1)}%`,"Risk"]} />
                <Bar dataKey="avg_risk" radius={[0,4,4,0]}>
                  {[...sectorData].sort((a,b)=>a.avg_risk-b.avg_risk).map(d => <Cell key={d.name} fill={SECTOR_COLORS[d.name] || "#64748B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>SECTOR AVG DIVIDEND YIELD</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[...sectorData].sort((a,b)=>b.avg_dividend-a.avg_dividend)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#475569", fontSize:10 }} tickFormatter={v=>`${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill:"#94A3B8", fontSize:10 }} width={80} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} formatter={v=>[`${v}%`,"Dividend"]} />
                <Bar dataKey="avg_dividend" radius={[0,4,4,0]}>
                  {[...sectorData].sort((a,b)=>b.avg_dividend-a.avg_dividend).map(d => <Cell key={d.name} fill={SECTOR_COLORS[d.name]||"#64748B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Full sector table */}
          <div style={{ gridColumn:"1/-1", background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>COMPLETE SECTOR METRICS TABLE</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr>{["Sector","Assets","Avg Return","Avg Risk","Avg ESG","Avg Dividend"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"#475569", fontWeight:600, borderBottom:"1px solid #1E293B" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {sectorData.map((d,i) => (
                    <tr key={d.name} style={{ background: i%2===0?"transparent":"rgba(255,255,255,0.01)" }}>
                      <td style={{ padding:"8px 12px" }}><span style={{ color:SECTOR_COLORS[d.name], fontWeight:700 }}>●</span> {d.name}</td>
                      <td style={{ padding:"8px 12px", color:"#94A3B8" }}>{d.count}</td>
                      <td style={{ padding:"8px 12px", color:"#22C55E", fontWeight:600 }}>{d.avg_return}%</td>
                      <td style={{ padding:"8px 12px", color:"#EF4444" }}>{(d.avg_risk*100).toFixed(1)}%</td>
                      <td style={{ padding:"8px 12px", color:"#F59E0B" }}>{d.avg_esg}</td>
                      <td style={{ padding:"8px 12px", color:"#A78BFA" }}>{d.avg_dividend}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ESG & ETHICS ── */}
      {tab === "ESG & Ethics" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>TOP 10 ASSETS BY ESG SCORE</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10ESG} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" domain={[0,100]} tick={{ fill:"#475569", fontSize:10 }} />
                <YAxis type="category" dataKey="Asset_Name" tick={{ fill:"#94A3B8", fontSize:9 }} width={130} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} formatter={v=>[v,"ESG Score"]} />
                <Bar dataKey="ESG_Score" radius={[0,4,4,0]}>
                  {top10ESG.map((d,i) => <Cell key={i} fill={`hsl(${140+i*3},70%,${55-i*2}%)`} />)}
                </Bar>
                <ReferenceLine x={65} stroke="#F59E0B" strokeDasharray="4 4" label={{ value:"Floor", fill:"#F59E0B", fontSize:9 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>SECTOR AVG ESG SCORE</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[...sectorData].sort((a,b)=>b.avg_esg-a.avg_esg)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fill:"#94A3B8", fontSize:9 }} angle={-30} textAnchor="end" height={55} />
                <YAxis domain={[0,100]} tick={{ fill:"#475569", fontSize:10 }} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} />
                <ReferenceLine y={65} stroke="#F59E0B" strokeDasharray="4 4" label={{ value:"Regulator Floor", fill:"#F59E0B", fontSize:9, position:"right" }} />
                <Bar dataKey="avg_esg" name="Avg ESG" radius={[4,4,0,0]}>
                  {[...sectorData].sort((a,b)=>b.avg_esg-a.avg_esg).map(d => <Cell key={d.name} fill={d.avg_esg>=65?"#22C55E":"#EF4444"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ESG vs Return scatter */}
          <div style={{ gridColumn:"1/-1", background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:4, letterSpacing:1 }}>ESG SCORE vs EXPECTED RETURN — The Ethics-Alpha Tradeoff</div>
            <div style={{ fontSize:11, color:"#334155", marginBottom:16 }}>Does ethical investing cost you returns? Color = Region.</div>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="ESG_Score" type="number" name="ESG" domain={[40,95]} tick={{ fill:"#475569", fontSize:10 }} label={{ value:"ESG Score", position:"insideBottom", offset:-10, fill:"#475569", fontSize:11 }} />
                <YAxis dataKey="Expected_Return" type="number" name="Return" domain={[0,30]} tick={{ fill:"#475569", fontSize:10 }} label={{ value:"Expected Return %", angle:-90, position:"insideLeft", fill:"#475569", fontSize:11 }} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, padding:"8px 12px", fontSize:12 }}>
                    <div style={{ fontWeight:700, color:"#E2E8F0" }}>{d.Asset_Name}</div>
                    <div style={{ color:"#64748B" }}>{d.Sector} · {d.Region}</div>
                    <div style={{ color:"#F59E0B" }}>ESG: {d.ESG_Score} | Return: {d.Expected_Return}%</div>
                  </div>;
                }} />
                <Scatter data={filtered} shape={(props) => {
                  const { cx, cy, payload } = props;
                  return <circle cx={cx} cy={cy} r={4} fill={REGION_COLORS[payload.Region] || "#64748B"} fillOpacity={0.75} stroke="none" />;
                }} />
                <ReferenceLine x={65} stroke="#F59E0B" strokeDasharray="4 4" />
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:16, marginTop:8 }}>
              {Object.entries(REGION_COLORS).map(([r,c]) => (
                <div key={r} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />
                  <span style={{ fontSize:11, color:"#94A3B8" }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RANKINGS ── */}
      {tab === "Rankings" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Top 10 Return */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>🏆 TOP 10 — HIGHEST EXPECTED RETURN</div>
            {top10Return.map((d,i) => (
              <div key={d.Asset_Name} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #0F172A" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background: i===0?"#F59E0B":i<=2?"#475569":"#1E293B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color: i<=2?"#070B14":"#64748B", flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#E2E8F0" }}>{d.Asset_Name}</div>
                  <div style={{ fontSize:10, color:"#475569" }}>{d.Sector} · {d.Region}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#22C55E" }}>{d.Expected_Return}%</div>
                  <div style={{ fontSize:10, color: d.Risk>0.35?"#EF4444":"#64748B" }}>Risk: {(d.Risk*100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top 10 ESG */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>🌱 TOP 10 — HIGHEST ESG SCORE</div>
            {top10ESG.map((d,i) => (
              <div key={d.Asset_Name} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #0F172A" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background: i===0?"#22C55E":i<=2?"#475569":"#1E293B", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color: i<=2?"#070B14":"#64748B", flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#E2E8F0" }}>{d.Asset_Name}</div>
                  <div style={{ fontSize:10, color:"#475569" }}>{d.Sector} · {d.Region}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#F59E0B" }}>{d.ESG_Score}<span style={{ fontSize:10, color:"#64748B" }}>/100</span></div>
                  <div style={{ fontSize:10, color:"#64748B" }}>Ret: {d.Expected_Return}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bull vs Bear */}
          <div style={{ gridColumn:"1/-1", background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, letterSpacing:1 }}>📊 BULL vs BEAR RETURNS — TOP 12 ASSETS BY SPREAD</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[...RAW].sort((a,b)=>(b.Bull_Return_Adjustment-b.Bear_Return_Adjustment)-(a.Bull_Return_Adjustment-a.Bear_Return_Adjustment)).slice(0,12)} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="Asset_Name" tick={{ fill:"#94A3B8", fontSize:8 }} angle={-25} textAnchor="end" height={55} />
                <YAxis tick={{ fill:"#475569", fontSize:10 }} tickFormatter={v=>`${v}%`} />
                <Tooltip contentStyle={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:8, fontSize:12 }} formatter={(v,n)=>[`${v}%`,n]} />
                <Legend wrapperStyle={{ fontSize:11 }} />
                <Bar dataKey="Bull_Return_Adjustment" name="🐂 Bull Return" fill="#22C55E" radius={[4,4,0,0]} />
                <Bar dataKey="Bear_Return_Adjustment" name="🐻 Bear Return" fill="#EF4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── CHATBOT ── */}
      {tab === "Chatbot" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, height:580 }}>
          {/* Chat window */}
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 20px", borderBottom:"1px solid #1E293B", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 6px #22C55E" }} />
              <span style={{ fontSize:13, fontWeight:700, color:"#E2E8F0" }}>PortfolioAI Assistant</span>
              <span style={{ fontSize:11, color:"#334155", marginLeft:8 }}>213 assets · 11 sectors · Live context</span>
              <span style={{ fontSize:11, color:"#475569", marginLeft:"auto" }}>Powered by Claude</span>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", flexDirection:"column", gap:14 }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
                  {m.role === "assistant" && (
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(167,139,250,0.15)", border:"1px solid #A78BFA44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth:"78%", padding:"11px 16px",
                    borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.role==="user" ? "rgba(0,212,255,0.12)" : "rgba(167,139,250,0.08)",
                    border:`1px solid ${m.role==="user" ? "#00D4FF33" : "#A78BFA22"}`,
                    fontSize:13, color:"#E2E8F0", lineHeight:1.65, whiteSpace:"pre-wrap"
                  }}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(0,212,255,0.15)", border:"1px solid #00D4FF44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, marginLeft:8, flexShrink:0, alignSelf:"flex-end" }}>👤</div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(167,139,250,0.15)", border:"1px solid #A78BFA44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
                  <div style={{ display:"flex", gap:5, padding:"12px 16px", background:"rgba(167,139,250,0.08)", border:"1px solid #A78BFA22", borderRadius:"16px 16px 16px 4px" }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#A78BFA", animation:`bounce 1.2s ${i*0.2}s infinite ease-in-out` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding:"14px 20px", borderTop:"1px solid #1E293B", display:"flex", gap:10 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask about assets, sectors, TOPSIS, agents, ESG..."
                style={{ flex:1, background:"#0F172A", border:"1px solid #1E293B", borderRadius:9, color:"#E2E8F0", padding:"10px 16px", fontSize:13, fontFamily:"inherit", outline:"none" }}
              />
              <button onClick={sendMessage} disabled={chatLoading} style={{
                background: chatLoading ? "#1E293B" : "rgba(0,212,255,0.15)",
                border:"1px solid #00D4FF44", color:"#00D4FF",
                padding:"10px 22px", borderRadius:9, cursor: chatLoading?"not-allowed":"pointer",
                fontSize:13, fontFamily:"inherit", fontWeight:700, transition:"all 0.2s"
              }}>
                {chatLoading ? "..." : "Send →"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Quick questions */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:16 }}>
              <div style={{ fontSize:11, color:"#475569", marginBottom:12, letterSpacing:1 }}>⚡ QUICK QUESTIONS</div>
              {[
                "Which sector has the best risk-return tradeoff?",
                "What is TOPSIS and how does it rank assets?",
                "Compare India vs Europe returns and ESG",
                "Which assets pass the ESG floor of 65?",
                "Explain the Investor Agent's reward function",
                "Best defensive assets for a bear market?",
                "Why is NVIDIA the top return asset?",
                "How does the Regulator Agent override others?",
              ].map(q => (
                <button key={q} onClick={() => setChatInput(q)} style={{
                  display:"block", width:"100%", textAlign:"left",
                  background:"rgba(255,255,255,0.02)", border:"1px solid #1E293B",
                  color:"#94A3B8", padding:"8px 12px", borderRadius:7,
                  cursor:"pointer", fontSize:11, fontFamily:"inherit", marginBottom:6,
                  transition:"all 0.15s"
                }}
                onMouseEnter={e => e.target.style.borderColor="#00D4FF44"}
                onMouseLeave={e => e.target.style.borderColor="#1E293B"}
                >{q}</button>
              ))}
            </div>

            {/* Live context */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:16, flex:1 }}>
              <div style={{ fontSize:11, color:"#475569", marginBottom:12, letterSpacing:1 }}>📊 LIVE CONTEXT</div>
              {[
                ["Total Assets", "213"],
                ["Sectors", "11"],
                ["Regions", "4"],
                ["Avg Return", "12.36%"],
                ["Avg ESG", "65.8"],
                ["ESG Floor", "≥ 65 (Regulator)"],
                ["Top Return", "NVIDIA 28.34%"],
                ["Top ESG", "Vestas 90/100"],
                ["Agents Active", "3/3 ✅"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, padding:"5px 0", borderBottom:"1px solid #0F172A" }}>
                  <span style={{ color:"#475569" }}>{k}</span>
                  <span style={{ color:"#E2E8F0", fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOPSIS ── */}
      {tab === "TOPSIS" && (() => {
        const totalW  = Object.values(tWeights).reduce((s,v) => s+v, 0) || 1;
        const topN    = topsisResults.slice(0, topsisN);
        const maxC    = topsisResults[0]?.cScore || 1;
        const CCOLORS = ["#00D4FF","#6EE7B7","#FCD34D","#F472B6","#A78BFA","#FB923C"];
        return (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Row 1: sliders + C-score bars */}
            <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:16 }}>

              {/* WSM Weight Sliders */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
                <div style={{ fontSize:12, color:"#475569", marginBottom:4, letterSpacing:1 }}>WSM CRITERIA WEIGHTS</div>
                <div style={{ fontSize:10, color:"#334155", marginBottom:16 }}>Drag sliders — rankings update live</div>
                {TCRITERIA.map((c,i) => {
                  const pct = Math.round((tWeights[c.wKey] / totalW) * 100);
                  return (
                    <div key={c.wKey} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:12, color:"#94A3B8", fontWeight:600 }}>
                          {c.label}
                          <span style={{ fontSize:10, color:"#475569", marginLeft:6 }}>{c.benefit ? "▲ benefit" : "▼ cost"}</span>
                        </span>
                        <span style={{ fontSize:12, color:CCOLORS[i], fontWeight:700 }}>{pct}%</span>
                      </div>
                      <div style={{ position:"relative", height:4, background:"#1E293B", borderRadius:4, marginBottom:2 }}>
                        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:CCOLORS[i], borderRadius:4, transition:"width 0.15s" }} />
                      </div>
                      <input type="range" min={0} max={100} value={tWeights[c.wKey]}
                        onChange={e => setTWeights(p => ({ ...p, [c.wKey]: +e.target.value }))}
                        style={{ width:"100%", accentColor:CCOLORS[i], cursor:"pointer", margin:0 }} />
                    </div>
                  );
                })}
                <button onClick={() => setTWeights({ Return:30, Risk:25, Liquidity:15, ESG:15, Dividend:10, Beta:5 })}
                  style={{ width:"100%", marginTop:4, padding:"7px 0", background:"rgba(0,212,255,0.08)", border:"1px solid #00D4FF44", color:"#00D4FF", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
                  Reset to defaults
                </button>
              </div>

              {/* C-score bars */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:12, color:"#475569", letterSpacing:1 }}>TOPSIS RANKING — C-SCORE</div>
                    <div style={{ fontSize:10, color:"#334155", marginTop:2 }}>Closeness coefficient · 0 = worst · 1 = best</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color:"#475569" }}>Show top</span>
                    <select value={topsisN} onChange={e => setTopsisN(+e.target.value)}
                      style={{ background:"#0F172A", border:"1px solid #1E293B", color:"#E2E8F0", borderRadius:6, padding:"4px 8px", fontSize:12, fontFamily:"inherit" }}>
                      {[10,15,20,30,50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ overflowY:"auto", maxHeight:420 }}>
                  {topN.map((d,i) => {
                    const barPct = (d.cScore / maxC) * 100;
                    const medal  = i===0 ? "🥇" : i===1 ? "🥈" : i===2 ? "🥉" : null;
                    const barCol = d.cScore >= 0.7 ? "#6EE7B7" : d.cScore >= 0.5 ? "#00D4FF" : d.cScore >= 0.35 ? "#FCD34D" : "#F87171";
                    return (
                      <div key={d.Asset_Name} style={{ marginBottom:8 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:12, color:"#CBD5E1" }}>
                            <span style={{ color:"#475569", marginRight:6, fontSize:11 }}>#{i+1}</span>
                            {medal && <span style={{ marginRight:4 }}>{medal}</span>}
                            {d.Asset_Name}
                            <span style={{ fontSize:10, color:"#475569", marginLeft:6 }}>{d.Sector}</span>
                          </span>
                          <span style={{ fontSize:12, color:barCol, fontWeight:700 }}>{d.cScore.toFixed(4)}</span>
                        </div>
                        <div style={{ height:6, background:"#0F172A", borderRadius:4 }}>
                          <div style={{ height:"100%", width:`${barPct}%`, background:barCol, borderRadius:4, transition:"width 0.2s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: full criteria breakdown table */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid #1E293B", borderRadius:12, padding:20 }}>
              <div style={{ fontSize:12, color:"#475569", letterSpacing:1, marginBottom:16 }}>FULL CRITERIA BREAKDOWN — TOP {topsisN}</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid #1E293B" }}>
                      <th style={{ textAlign:"left",  padding:"6px 10px", color:"#475569" }}>#</th>
                      <th style={{ textAlign:"left",  padding:"6px 10px", color:"#475569" }}>Asset</th>
                      <th style={{ textAlign:"left",  padding:"6px 10px", color:"#475569" }}>Sector</th>
                      {TCRITERIA.map((c,i) => (
                        <th key={c.key} style={{ textAlign:"right", padding:"6px 10px", color:CCOLORS[i] }}>
                          {c.label}<br/>
                          <span style={{ fontSize:9, color:"#334155", fontWeight:400 }}>{c.benefit?"▲":"▼"} {Math.round((tWeights[c.wKey]/totalW)*100)}%</span>
                        </th>
                      ))}
                      <th style={{ textAlign:"right", padding:"6px 10px", color:"#60A5FA" }}>D+</th>
                      <th style={{ textAlign:"right", padding:"6px 10px", color:"#6EE7B7" }}>D−</th>
                      <th style={{ textAlign:"right", padding:"6px 10px", color:"#FCD34D" }}>C-score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topN.map((d,i) => (
                      <tr key={d.Asset_Name} style={{ borderBottom:"1px solid #0F172A", background:i%2===0?"transparent":"rgba(255,255,255,0.01)" }}>
                        <td style={{ padding:"6px 10px", color:"#475569" }}>{i+1}</td>
                        <td style={{ padding:"6px 10px", color:"#E2E8F0", fontWeight:600 }}>{d.Asset_Name}</td>
                        <td style={{ padding:"6px 10px", color:"#64748B" }}>{d.Sector}</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#94A3B8" }}>{d.Expected_Return.toFixed(1)}%</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#94A3B8" }}>{(d.Risk*100).toFixed(1)}%</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#94A3B8" }}>{d.Liquidity.toFixed(2)}</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#94A3B8" }}>{d.ESG_Score}</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#94A3B8" }}>{d.Dividend_Yield.toFixed(2)}%</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#94A3B8" }}>{d.Beta.toFixed(2)}</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#60A5FA" }}>{d.dPlus.toFixed(4)}</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", color:"#6EE7B7" }}>{d.dMinus.toFixed(4)}</td>
                        <td style={{ padding:"6px 10px", textAlign:"right", fontWeight:700,
                          color:d.cScore>=0.7?"#6EE7B7":d.cScore>=0.5?"#00D4FF":d.cScore>=0.35?"#FCD34D":"#F87171" }}>
                          {d.cScore.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        );
      })()}

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-5px);opacity:1} }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#0F172A}
        ::-webkit-scrollbar-thumb{background:#1E293B;border-radius:4px}
        select{outline:none;cursor:pointer}
      `}</style>
    </div>
  );
}
