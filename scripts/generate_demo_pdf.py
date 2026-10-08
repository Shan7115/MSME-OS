import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 7.5)
            self.setFillColor(colors.HexColor("#1e3a8a"))
            self.drawString(54, 752, "COMMERCIAL CREDIT APPRAISAL DOSSIER")
            
            self.setFont("Helvetica", 7.5)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawString(220, 752, "|   SRI MURUGAN AGRO FOODS & SPICES PVT. LTD.")
            self.drawRightString(612 - 54, 752, "UDYAM-TN-08-0019284  •  FY 2024-25")
            
            # Double line header
            self.setStrokeColor(colors.HexColor("#1e3a8a"))
            self.setLineWidth(1)
            self.line(54, 746, 612 - 54, 746)
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 743, 612 - 54, 743)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, 46, 612 - 54, 46)

        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#991b1b"))
        self.drawString(54, 34, "CONFIDENTIAL")

        self.setFont("Helvetica", 7)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(120, 34, "FOR BANK APPRAISAL & PROMOTER DECISIONING ONLY  •  SYNTHETIC DEMO SPECIMEN")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#334155"))
        self.drawRightString(612 - 54, 34, page_str)

        self.restoreState()

def build_professional_pdf(output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Refined styles
    doc_badge_style = ParagraphStyle(
        'DocBadge',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1e3a8a'),
        textTransform='uppercase'
    )
    main_title_style = ParagraphStyle(
        'MainTitle',
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    sub_title_style = ParagraphStyle(
        'SubTitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14
    )
    h1_style = ParagraphStyle(
        'H1',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1e3a8a'),
        spaceBefore=14,
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'H2',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )
    callout_text_style = ParagraphStyle(
        'CalloutText',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#1e293b')
    )
    callout_bold_style = ParagraphStyle(
        'CalloutBold',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#991b1b')
    )
    th_style = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
        alignment=0
    )
    td_style = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#1e293b')
    )
    td_bold_style = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#0f172a')
    )
    td_alert_style = ParagraphStyle(
        'TableCellAlert',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#b91c1c')
    )

    story = []

    # =========================================================================
    # PAGE 1: FORMAL EXECUTIVE COVER & CREDIT APPRAISAL DOSSIER
    # =========================================================================
    
    # Top Classification Header Box
    top_bar = [
        [Paragraph("<b>CREDIT APPRAISAL DOSSIER</b> | REF: APP-TN-ERD-2024-8841", doc_badge_style),
         Paragraph("<b>STATUS:</b> UNDER EXPANSION SCRUTINY", ParagraphStyle('R', parent=doc_badge_style, alignment=2, textColor=colors.HexColor('#b45309')))]
    ]
    t_bar = Table(top_bar, colWidths=[350, 154])
    t_bar.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_bar)
    story.append(Spacer(1, 14))

    story.append(Paragraph("DETAILED PROJECT REPORT & CREDIT EXPANSION PROFILE", main_title_style))
    story.append(Paragraph("Commercial Term Loan Appraisal (₹30.00 Lakhs) & Working Capital Diagnostics under CGTMSE Scheme", sub_title_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1e3a8a'), spaceAfter=14))

    # Enterprise Profile Summary Box
    summary_grid = [
        [Paragraph("<b>Enterprise Name:</b>", td_bold_style), Paragraph("Sri Murugan Agro Foods & Spices Pvt. Ltd.", td_style),
         Paragraph("<b>Enterprise Category:</b>", td_bold_style), Paragraph("Small Enterprise (Manufacturing)", td_style)],
        [Paragraph("<b>Udyam Registration:</b>", td_bold_style), Paragraph("UDYAM-TN-08-0019284", td_bold_style),
         Paragraph("<b>Incorporation Date:</b>", td_bold_style), Paragraph("14th November 2018", td_style)],
        [Paragraph("<b>Manufacturing Unit:</b>", td_bold_style), Paragraph("Plot 42-A, SIPCOT Industrial Complex, Perundurai, Erode — 638052", td_style),
         Paragraph("<b>NIC Activity Code:</b>", td_bold_style), Paragraph("10795 (Spices & Blended Seasonings)", td_style)],
        [Paragraph("<b>Promoter & MD:</b>", td_bold_style), Paragraph("Mr. S. Karthikeyan (B.Tech Food Tech, 14 Yrs Exp)", td_style),
         Paragraph("<b>Joint Director:</b>", td_bold_style), Paragraph("Mrs. Priya Karthikeyan (M.Com, Head of Finance)", td_style)],
        [Paragraph("<b>Banking Partner:</b>", td_bold_style), Paragraph("Canara Bank, Erode Main Branch (CC A/c)", td_style),
         Paragraph("<b>Statutory Licenses:</b>", td_bold_style), Paragraph("GST: 33AAECS8912P1ZA | FSSAI: 12419008000412", td_style)],
        [Paragraph("<b>Facility Requested:</b>", td_bold_style), Paragraph("<b>Term Loan: ₹ 30.00 Lakhs</b> (Machinery Capex)", td_bold_style),
         Paragraph("<b>Existing Working Capital:</b>", td_bold_style), Paragraph("Cash Credit: ₹ 20.00 Lakhs (Active Limit)", td_style)]
    ]
    t_summary = Table(summary_grid, colWidths=[110, 150, 114, 130])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 14))

    # Executive Summary Paragraphs
    story.append(Paragraph("1. Executive Memorandum & Appraisal Scope", h1_style))
    story.append(Paragraph(
        "Sri Murugan Agro Foods & Spices Pvt. Ltd. operates a high-capacity spice processing facility in the prime turmeric-producing corridor of Erode, Tamil Nadu. "
        "The enterprise specializes in steam-sterilized pulverization, optical grading, and consumer packaging of high-curcumin Erode turmeric rhizomes, Guntur red chillies, coriander seed formulations, and authentic Chettinad culinary spice mixes. "
        "During Fiscal Year 2023-24, the enterprise recorded audited operating revenue of <b>₹ 142.50 Lakhs</b> (₹ 1.425 Crores) with a gross margin of <b>22.1%</b> and Net Profit After Tax (PAT) of <b>₹ 8.26 Lakhs (5.8% NPM)</b>.",
        body_style
    ))
    story.append(Paragraph(
        "This Comprehensive Project Report is submitted to financial institutions to secure a <b>Term Loan facility of ₹ 30.00 Lakhs</b> under the Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE). "
        "The capital proceeds will fund the procurement and commissioning of an automated high-speed nitrogen-flushing pouch packaging machine, an advanced continuous vibratory grading sifter assembly, and civil transformer substation upgrades. "
        "The expansion will expand processing throughput from 2.0 to 4.5 metric tons per day, eliminating seasonal backlogs and unlocking packaged consumer retail distribution across Kerala and Karnataka.",
        body_style
    ))

    # Credit Warning Callout Box on Page 1
    alert_box_data = [[
        Paragraph(
            "<b>PRELIMINARY APPRAISAL HIGHLIGHT:</b> While operating fundamentals and gross profit margins remain strong (22.1%), "
            "the enterprise exhibits two significant credit risk factors: (1) <b>Customer concentration exposure</b> with single buyer Kaveri Hypermarkets accounting for <b>38.0% of sales</b> with delayed 88-day debtor realizations, and (2) <b>Peak Cash Credit limit utilization of 92.5%</b>. "
            "Both items require immediate working-capital covenants.",
            callout_text_style
        )
    ]]
    t_alert1 = Table(alert_box_data, colWidths=[504])
    t_alert1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef2f2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#f87171')),
        ('LINELEFT', (0,0), (0,0), 3.5, colors.HexColor('#dc2626')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(Spacer(1, 4))
    story.append(t_alert1)

    # =========================================================================
    # PAGE 2: INFRASTRUCTURE, PLANT & MACHINERY SCHEDULE
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("2. Manufacturing Infrastructure, Facility Assets & Plant Capacity", h1_style))
    story.append(Paragraph(
        "The manufacturing infrastructure is situated on a 6,500 sq.ft freehold industrial plot within the SIPCOT Industrial Growth Centre, Perundurai. "
        "The facility features specialized zoned areas for raw material fumigation, secondary dust collection, milling, formulation blending, and finished stock warehousing.",
        body_style
    ))

    prod_headers = [Paragraph("Product SKU / Line", th_style), Paragraph("Specification / Mesh", th_style), Paragraph("FY24 Output", th_style), Paragraph("Installed Cap. Util.", th_style), Paragraph("FOB Unit Realization", th_style)]
    prod_rows = [
        prod_headers,
        [Paragraph("Pure Erode Turmeric Powder", td_bold_style), Paragraph("High-Curcumin (3.8%), 100 mesh", td_style), Paragraph("185 MT", td_style), Paragraph("74.0%", td_style), Paragraph("₹ 165.00 / kg", td_style)],
        [Paragraph("Guntur Steam Red Chilli", td_bold_style), Paragraph("Steam sterilized, SHU 25,000", td_style), Paragraph("110 MT", td_style), Paragraph("68.7%", td_style), Paragraph("₹ 240.00 / kg", td_style)],
        [Paragraph("Coriander & Cumin Powder", td_bold_style), Paragraph("Dry roasted, fine sieve grade", td_style), Paragraph("85 MT", td_style), Paragraph("65.4%", td_style), Paragraph("₹ 195.00 / kg", td_style)],
        [Paragraph("Chettinad Sambhar Blend", td_bold_style), Paragraph("Traditional 14-spice blend", td_style), Paragraph("62 MT", td_style), Paragraph("62.0%", td_style), Paragraph("₹ 280.00 / kg", td_style)],
        [Paragraph("<b>Total Aggregate Output</b>", td_bold_style), Paragraph("<b>Blended annual volume</b>", td_bold_style), Paragraph("<b>442 MT</b>", td_bold_style), Paragraph("<b>67.9% avg</b>", td_bold_style), Paragraph("<b>—</b>", td_bold_style)]
    ]
    t_prod = Table(prod_rows, colWidths=[130, 134, 75, 85, 80])
    t_prod.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, colors.HexColor('#f8fafc')]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#f1f5f9')),
    ]))
    story.append(t_prod)
    story.append(Spacer(1, 12))

    story.append(Paragraph("3. Machinery Schedule & Critical Bottleneck Assessment", h2_style))
    story.append(Paragraph(
        "Active production assets comprise: (1) 25 HP Heavy Duty Impact Pulverizer (Commissioned 2018), (2) Rotary Sifter with dust-collector ducting, (3) Semi-automatic two-head pneumatic pouch sealer, and (4) 30 KVA Diesel Generator backup. "
        "The factory employs 12 full-time permanent technicians and 8 seasonal contract workers during peak harvest months (February to May).",
        body_style
    ))

    # Bottleneck callout
    bn_callout = [[
        Paragraph(
            "<b>OPERATIONAL BOTTLENECK FINDING:</b> The existing semi-automatic packaging unit is capped at <b>1,200 pouches per hour</b>. "
            "Because milling output exceeds packaging capacity by 140%, fresh ground spices must be held in open intermediate silos for up to <b>96 hours</b>. "
            "This delay leads to volatile essential oil dissipation and aroma degradation. "
            "Commissioning the proposed nitrogen-flushing automated line will eliminate this bottleneck and increase retail shelf life from 6 to 12 months.",
            callout_text_style
        )
    ]]
    t_bn = Table(bn_callout, colWidths=[504])
    t_bn.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff6ff')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#bfdbfe')),
        ('LINELEFT', (0,0), (0,0), 3.5, colors.HexColor('#2563eb')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_bn)

    # =========================================================================
    # PAGE 3: SALES DISTRIBUTION & CUSTOMER CONCENTRATION
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("4. Market Distribution Channels & Customer Concentration Risk", h1_style))
    story.append(Paragraph(
        "The company distributes products through three distinct commercial channels: "
        "(a) Regional wholesale distributors in Western Tamil Nadu; "
        "(b) Organized retail supermarket chains; and "
        "(c) Institutional bulk sales to educational hostels and industrial canteens.",
        body_style
    ))

    cust_headers = [Paragraph("Client / Customer Segment", th_style), Paragraph("Channel Structure", th_style), Paragraph("FY24 Revenue", th_style), Paragraph("% Share", th_style), Paragraph("Contractual vs Actual Realization", th_style)]
    cust_rows = [
        cust_headers,
        [Paragraph("Kaveri Hypermarkets Pvt Ltd", td_bold_style), Paragraph("Supermarket Retail Chain", td_style), Paragraph("₹ 54.15 Lakhs", td_bold_style), Paragraph("38.0% [CRITICAL]", td_alert_style), Paragraph("Agreed 30 days | Actual 85–92 days", td_alert_style)],
        [Paragraph("Kongu Wholesale Network (5 Dist.)", td_style), Paragraph("Regional Distributors", td_style), Paragraph("₹ 48.45 Lakhs", td_style), Paragraph("34.0%", td_style), Paragraph("Agreed 21 days | Actual 35–42 days", td_style)],
        [Paragraph("Nilgiris Hotel & Catering Guild", td_style), Paragraph("Institutional Bulk Canteens", td_style), Paragraph("₹ 22.80 Lakhs", td_style), Paragraph("16.0%", td_style), Paragraph("Agreed 15 days | Actual 20 days", td_style)],
        [Paragraph("Direct Factory Counter & D2C", td_style), Paragraph("Cash & UPI Retail", td_style), Paragraph("₹ 17.10 Lakhs", td_style), Paragraph("12.0%", td_style), Paragraph("Immediate cash settlement", td_style)],
        [Paragraph("<b>Total Operating Revenue</b>", td_bold_style), Paragraph("<b>All Sales Channels</b>", td_bold_style), Paragraph("<b>₹ 142.50 Lakhs</b>", td_bold_style), Paragraph("<b>100.0%</b>", td_bold_style), Paragraph("<b>Weighted Average DSO: 78.4 Days</b>", td_bold_style)]
    ]
    t_cust = Table(cust_rows, colWidths=[120, 110, 85, 95, 94])
    t_cust.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#fef2f2')),
        ('ROWBACKGROUNDS', (0,2), (-1,-2), [colors.white, colors.HexColor('#f8fafc')]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#f1f5f9')),
    ]))
    story.append(t_cust)
    story.append(Spacer(1, 10))

    cust_risk_callout = [[
        Paragraph(
            "<b>CRITICAL CREDIT RISK CITATION — CUSTOMER CONCENTRATION:</b> "
            "A single counterparty, <b>Kaveri Hypermarkets Pvt Ltd</b>, commands <b>38.0% of total enterprise sales</b> (₹ 54.15 Lakhs). "
            "Furthermore, Kaveri Hypermarkets consistently defaults on contractual 30-day payment covenants, stretching receivables to <b>88 days on average</b>. "
            "Any contractual dispute, procurement margin renegotiation, or delayed payment cycle by Kaveri Hypermarkets directly threatens the company's Cash Credit debt servicing capacity. "
            "<b>Remediation Requirement:</b> Mandate milestone-based invoice discounting (TReDS) on Kaveri receivables and expand independent retail stockists to cap any single client below 20%.",
            callout_text_style
        )
    ]]
    t_cr = Table(cust_risk_callout, colWidths=[504])
    t_cr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef2f2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fca5a5')),
        ('LINELEFT', (0,0), (0,0), 3.5, colors.HexColor('#dc2626')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_cr)

    # =========================================================================
    # PAGE 4: PROCUREMENT, WORKING CAPITAL & SUPPLIER CONCENTRATION
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("5. Raw Material Procurement, Supply Chain & Working Capital Analysis", h1_style))
    story.append(Paragraph(
        "Agricultural commodities (turmeric rhizomes and dry red chillies) exhibit pronounced seasonal harvest procurement peaks between January and April. "
        "The enterprise purchases raw stock through the Erode regulated agricultural mandi and Salem auction exchanges.",
        body_style
    ))

    supp_headers = [Paragraph("Supplier Syndicate / Entity", th_style), Paragraph("Commodity Sourced", th_style), Paragraph("Procurement Value", th_style), Paragraph("% Share", th_style), Paragraph("Payment Terms Enforced", th_style)]
    supp_rows = [
        supp_headers,
        [Paragraph("Salem Valley Farmer Cluster", td_bold_style), Paragraph("Turmeric Rhizomes", td_style), Paragraph("₹ 65.80 Lakhs", td_bold_style), Paragraph("72.1% [HIGH CONC.]", td_alert_style), Paragraph("Spot Cash / Advance 10 days", td_alert_style)],
        [Paragraph("Guntur Chilli Trading Syndicate", td_style), Paragraph("Dry Red Chillies (Teja)", td_style), Paragraph("₹ 18.25 Lakhs", td_style), Paragraph("20.0%", td_style), Paragraph("15 days credit", td_style)],
        [Paragraph("Dindigul Seed Producers Assn", td_style), Paragraph("Coriander & Cumin", td_style), Paragraph("₹ 7.20 Lakhs", td_style), Paragraph("7.9%", td_style), Paragraph("Cash on delivery", td_style)],
        [Paragraph("<b>Total Raw Material Intake</b>", td_bold_style), Paragraph("<b>Agricultural commodities</b>", td_bold_style), Paragraph("<b>₹ 91.25 Lakhs</b>", td_bold_style), Paragraph("<b>100.0%</b>", td_bold_style), Paragraph("<b>Raw Material Ratio: 64.0% of Sales</b>", td_bold_style)]
    ]
    t_supp = Table(supp_rows, colWidths=[130, 110, 85, 95, 84])
    t_supp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#fef2f2')),
        ('ROWBACKGROUNDS', (0,2), (-1,-2), [colors.white, colors.HexColor('#f8fafc')]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#f1f5f9')),
    ]))
    story.append(t_supp)
    story.append(Spacer(1, 10))

    story.append(Paragraph("6. Cash Credit Facility Pressure & Inventory Buffer Lockup", h2_style))
    story.append(Paragraph(
        "The enterprise operates a sanctioned <b>Cash Credit (CC) limit of ₹ 20.00 Lakhs</b> with Canara Bank against hypothecation of stock and book debts. "
        "Because raw material procurement requires immediate cash or advance payment while customer collections extend to 78.4 days DSO, "
        "the CC facility experienced peak drawing power utilization averaging <b>92.5% across trailing 12 months</b>. "
        "Additionally, seasonal warehouse buffer stock requires <b>45.2 days inventory holding</b> (inventory asset value: ₹ 22.8 Lakhs), locking substantial liquidity in warehouse sheds.",
        body_style
    ))

    supp_risk_callout = [[
        Paragraph(
            "<b>SUPPLIER DEPENDENCY CITATION:</b> A single agricultural cooperative, <i>Salem Valley Farmer Cluster</i>, supplies <b>72.1% of raw turmeric intake</b>. "
            "The enterprise holds no secondary formal forward-procurement contracts with alternate agricultural clusters in Dharmapuri or Nizamabad, leaving milling operations exposed to localized harvest failure or supplier cartelization. "
            "<b>Action:</b> Contract secondary procurement with Dharmapuri Farmer Producer Organizations (FPOs) to bring Salem cluster dependency under 50%.",
            callout_text_style
        )
    ]]
    t_sr = Table(supp_risk_callout, colWidths=[504])
    t_sr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffbeb')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fde68a')),
        ('LINELEFT', (0,0), (0,0), 3.5, colors.HexColor('#d97706')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sr)

    # =========================================================================
    # PAGE 5: MULTI-YEAR FINANCIAL AUDIT & PROJECTIONS
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("7. Audited Financial Statements & Post-Expansion Projections", h1_style))
    story.append(Paragraph(
        "Comparative Profit & Loss accounts spanning FY 2022-23 (Audited), FY 2023-24 (Audited), and FY 2024-25 (Projected post-commissioning) demonstrate stable gross margins and sustainable debt service capability:",
        body_style
    ))

    fin_headers = [Paragraph("Financial Metric / Parameter", th_style), Paragraph("FY 2022-23 (Audited)", th_style), Paragraph("FY 2023-24 (Audited)", th_style), Paragraph("FY 2024-25 (Projected)", th_style), Paragraph("Trend & Benchmarks", th_style)]
    fin_rows = [
        fin_headers,
        [Paragraph("Gross Revenue from Operations", td_bold_style), Paragraph("₹ 105.40 Lakhs", td_style), Paragraph("₹ 142.50 Lakhs", td_bold_style), Paragraph("₹ 210.00 Lakhs", td_bold_style), Paragraph("+47.4% projected jump", td_style)],
        [Paragraph("Raw Material Consumed (64%)", td_style), Paragraph("₹ 67.45 Lakhs", td_style), Paragraph("₹ 91.25 Lakhs", td_style), Paragraph("₹ 132.30 Lakhs", td_style), Paragraph("63.0% of turnover", td_style)],
        [Paragraph("Direct Factory Wages & Labor", td_style), Paragraph("₹ 12.10 Lakhs", td_style), Paragraph("₹ 15.68 Lakhs", td_style), Paragraph("₹ 21.00 Lakhs", td_style), Paragraph("10.0% of turnover", td_style)],
        [Paragraph("Power, Fuel & Utility Exp.", td_style), Paragraph("₹ 7.80 Lakhs", td_style), Paragraph("₹ 9.98 Lakhs", td_style), Paragraph("₹ 13.65 Lakhs", td_style), Paragraph("6.5% of turnover", td_style)],
        [Paragraph("<b>Gross Profit Margin (₹ / %)</b>", td_bold_style), Paragraph("<b>₹ 23.45 L (22.2%)</b>", td_bold_style), Paragraph("<b>₹ 31.50 L (22.1%)</b>", td_bold_style), Paragraph("<b>₹ 48.05 L (22.9%)</b>", td_bold_style), Paragraph("<b>Stable ~22-23%</b>", td_bold_style)],
        [Paragraph("Logistics & Freight Outward", td_style), Paragraph("₹ 6.20 Lakhs", td_style), Paragraph("₹ 8.55 Lakhs", td_style), Paragraph("₹ 11.55 Lakhs", td_style), Paragraph("5.5% of turnover", td_style)],
        [Paragraph("Admin, Marketing & Statutory Exp.", td_style), Paragraph("₹ 4.10 Lakhs", td_style), Paragraph("₹ 5.80 Lakhs", td_style), Paragraph("₹ 7.35 Lakhs", td_style), Paragraph("3.5% of turnover", td_style)],
        [Paragraph("Finance Charges & CC Interest", td_style), Paragraph("₹ 2.40 Lakhs", td_style), Paragraph("₹ 2.85 Lakhs", td_style), Paragraph("₹ 6.10 Lakhs", td_style), Paragraph("Includes proposed loan", td_style)],
        [Paragraph("Depreciation (Plant & Machinery)", td_style), Paragraph("₹ 4.80 Lakhs", td_style), Paragraph("₹ 5.04 Lakhs", td_style), Paragraph("₹ 7.85 Lakhs", td_style), Paragraph("Straight line method", td_style)],
        [Paragraph("Net Operating Profit Before Tax", td_bold_style), Paragraph("₹ 8.15 Lakhs", td_style), Paragraph("₹ 11.18 Lakhs", td_style), Paragraph("₹ 18.05 Lakhs", td_style), Paragraph("+61.4% PBT growth", td_style)],
        [Paragraph("Provision for Corporate Taxes", td_style), Paragraph("₹ 2.12 Lakhs", td_style), Paragraph("₹ 2.92 Lakhs", td_style), Paragraph("₹ 4.69 Lakhs", td_style), Paragraph("26% corporate slab", td_style)],
        [Paragraph("<b>Net Profit After Tax (PAT / NPM)</b>", td_bold_style), Paragraph("<b>₹ 6.03 L (5.7%)</b>", td_bold_style), Paragraph("<b>₹ 8.26 L (5.8%)</b>", td_bold_style), Paragraph("<b>₹ 13.36 L (6.4%)</b>", td_bold_style), Paragraph("<b>Target NPM: 6.36%</b>", td_bold_style)],
        [Paragraph("<b>Debt Service Coverage Ratio (DSCR)</b>", td_bold_style), Paragraph("<b>2.45x</b>", td_bold_style), Paragraph("<b>2.18x</b>", td_bold_style), Paragraph("<b>1.74x</b>", td_bold_style), Paragraph("<b>Banking norm >1.50x</b>", td_bold_style)]
    ]
    t_fin = Table(fin_rows, colWidths=[150, 90, 90, 95, 79])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BACKGROUND', (0,5), (-1,5), colors.HexColor('#eff6ff')),
        ('BACKGROUND', (0,12), (-1,12), colors.HexColor('#ecfdf5')),
        ('BACKGROUND', (0,13), (-1,13), colors.HexColor('#f1f5f9')),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Auditor Certificate Note:</b> Figures for FY 2022-23 and FY 2023-24 are audited and attested by M/s R. Srinivasan & Associates, Chartered Accountants (FRN: 004128S). "
        "The <b>FY25 projection of ₹ 210.00 Lakhs assumes a 47.4% top-line expansion</b>; bank sanction is conditional on firm buyer purchase agreements.",
        body_style
    ))

    # =========================================================================
    # PAGE 6: REGULATORY STATUS, CAPEX BUDGET & 30/60/90 PLAN
    # =========================================================================
    story.append(PageBreak())
    story.append(Paragraph("8. Regulatory Compliance, Documentation Gaps & Project Budget", h1_style))
    story.append(Paragraph(
        "Statutory verification indicates strong baseline credentials but flags one unmitigated regulatory gap in factory safety documentation:",
        body_style
    ))

    stat_headers = [Paragraph("Statutory / Regulatory Clearance", th_style), Paragraph("Registration / Reference ID", th_style), Paragraph("Status", th_style), Paragraph("Compliance Finding & Required Action", th_style)]
    stat_rows = [
        stat_headers,
        [Paragraph("Udyam Registration", td_bold_style), Paragraph("UDYAM-TN-08-0019284", td_style), Paragraph("Active & Verified", td_style), Paragraph("Registered under MSME Ministry portal", td_style)],
        [Paragraph("FSSAI State Manufacturing Lic.", td_bold_style), Paragraph("12419008000412", td_style), Paragraph("Active (Valid till 2027)", td_style), Paragraph("Compliant with Food Safety & Standards Act", td_style)],
        [Paragraph("GST Filing Compliance", td_bold_style), Paragraph("33AAECS8912P1ZA", td_style), Paragraph("Filed (Minor Delays)", td_style), Paragraph("Regular GSTR-3B filed; 2 delayed filings in Q3 FY24 (paid ₹4,200 fine)", td_style)],
        [Paragraph("Fire Safety NOC Inspection", td_bold_style), Paragraph("District Fire Office, Erode", td_alert_style), Paragraph("MISSING / DEFICIT", td_alert_style), Paragraph("Warehouse extension constructed without formal Fire Safety NOC inspection", td_alert_style)],
        [Paragraph("TNPCB Consent to Operate", td_bold_style), Paragraph("Orange Category Lic. 8812", td_style), Paragraph("Valid till March 2026", td_style), Paragraph("Air & water pollution clearances verified", td_style)],
        [Paragraph("Provisional FY25 Projections", td_bold_style), Paragraph("CA Attestation Certificate", td_alert_style), Paragraph("PENDING ATTESTATION", td_alert_style), Paragraph("Requires formal CA net-worth and projected P&L attestation", td_alert_style)]
    ]
    t_stat = Table(stat_rows, colWidths=[120, 110, 100, 174])
    t_stat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('BACKGROUND', (0,4), (-1,4), colors.HexColor('#fef2f2')),
        ('BACKGROUND', (0,6), (-1,6), colors.HexColor('#fffbeb')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    story.append(t_stat)
    story.append(Spacer(1, 10))

    story.append(Paragraph("9. Capital Expenditure Cost Breakdown and Promoter Funding Shortfall", h2_style))
    capex_headers = [Paragraph("Capital Investment Component", th_style), Paragraph("Estimated Cost", th_style), Paragraph("Appraised Financing Source & Status", th_style)]
    capex_rows = [
        capex_headers,
        [Paragraph("Automated Nitrogen Form-Fill-Seal Packaging Line", td_bold_style), Paragraph("₹ 22.50 Lakhs", td_style), Paragraph("Proposed Commercial Bank Term Loan", td_style)],
        [Paragraph("Continuous Vibratory Sifter & Grading Assembly", td_bold_style), Paragraph("₹ 7.50 Lakhs", td_style), Paragraph("Proposed Commercial Bank Term Loan", td_style)],
        [Paragraph("Civil Shed Foundation & Transformer Substation", td_bold_style), Paragraph("₹ 10.00 Lakhs", td_style), Paragraph("Promoter Internal Equity Contribution", td_style)],
        [Paragraph("Contingency Reserves & Pre-operative Expenses", td_bold_style), Paragraph("₹ 5.00 Lakhs", td_alert_style), Paragraph("PROMOTER EQUITY SHORTFALL (₹ 5.00 Lakhs Gap)", td_alert_style)],
        [Paragraph("<b>Total Project Capital Outlay</b>", td_bold_style), Paragraph("<b>₹ 45.00 Lakhs</b>", td_bold_style), Paragraph("<b>Bank Loan: ₹30.00 L | Promoter: ₹10.00 L | Deficit: ₹5.00 L</b>", td_bold_style)]
    ]
    t_capex = Table(capex_rows, colWidths=[180, 110, 214])
    t_capex.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#334155')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 3.5),
        ('BACKGROUND', (0,4), (-1,4), colors.HexColor('#fef2f2')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#f1f5f9')),
    ]))
    story.append(t_capex)
    story.append(Spacer(1, 8))

    story.append(Paragraph("10. Strategic 30/60/90-Day Priority Action Framework", h2_style))
    story.append(Paragraph(
        "<b>Day 0–30 (Immediate Remediation):</b> "
        "(1) Implement TReDS invoice discounting on Kaveri Hypermarkets receivables to liberate ₹18 Lakhs frozen liquidity and pull CC utilization below 75%; "
        "(2) Regularize warehouse Fire Safety NOC inspection with District Fire Officer; "
        "(3) Formalize promoter ₹5.00 Lakhs shortfall through unsecured family loans or Tamil Nadu NEEDS grant.<br/>"
        "<b>Day 31–60 (Supply Chain & Revenue De-risking):</b> "
        "(1) Contract secondary raw material supply with 2 Dharmapuri Farmer Producer Organizations (FPOs) to dilute Salem cluster concentration from 72% to under 50%; "
        "(2) Introduce automated batch inventory tracking to trim holding cycle from 45 to 30 days.<br/>"
        "<b>Day 61–90 (Capacity Expansion & Commercialization):</b> "
        "(1) Complete installation and dry-run of nitrogen pouch packaging line; "
        "(2) Secure formal distributor appointments across Kerala and Karnataka, lifting branded retail mix to 35%.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Ultra-professional demo PDF generated at: {output_path}")

if __name__ == '__main__':
    target = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sample-data', 'demo-document.pdf')
    build_professional_pdf(target)
