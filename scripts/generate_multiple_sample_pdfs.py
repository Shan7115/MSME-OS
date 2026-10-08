import os
import sys
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class DynamicNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, company_name="MSME ENTERPRISE", udyam_code="UDYAM-XX-00-0000000", **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []
        self.company_name = company_name
        self.udyam_code = udyam_code

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
            self.drawString(220, 752, f"|   {self.company_name.upper()}")
            self.drawRightString(612 - 54, 752, f"{self.udyam_code}  •  FY 2024-25")
            
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
        self.drawString(120, 34, "FOR BANK APPRAISAL & CREDIT COMMITTEE REVIEW  •  SYNTHETIC SPECIMEN")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#334155"))
        self.drawRightString(612 - 54, 34, page_str)

        self.restoreState()

def create_canvas_factory(company_name, udyam_code):
    def factory(*args, **kwargs):
        return DynamicNumberedCanvas(*args, company_name=company_name, udyam_code=udyam_code, **kwargs)
    return factory

def get_base_styles():
    styles = getSampleStyleSheet()
    return {
        'badge': ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#1e3a8a')),
        'title': ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=colors.HexColor('#0f172a'), spaceAfter=4),
        'subtitle': ParagraphStyle('Sub', fontName='Helvetica', fontSize=10.5, leading=14, textColor=colors.HexColor('#475569'), spaceAfter=12),
        'h1': ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=13, leading=16, textColor=colors.HexColor('#1e3a8a'), spaceBefore=12, spaceAfter=8),
        'h2': ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=colors.HexColor('#0f172a'), spaceBefore=8, spaceAfter=4),
        'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=9, leading=13, textColor=colors.HexColor('#334155'), spaceAfter=6),
        'body_bold': ParagraphStyle('BodyBold', fontName='Helvetica-Bold', fontSize=9, leading=13, textColor=colors.HexColor('#0f172a')),
        'table_cell': ParagraphStyle('TableCell', fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#334155')),
        'table_cell_bold': ParagraphStyle('TableCellBold', fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=colors.HexColor('#0f172a')),
        'table_header': ParagraphStyle('TableHdr', fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=colors.HexColor('#ffffff')),
        'risk_crit': ParagraphStyle('RiskCrit', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#b91c1c')),
        'risk_high': ParagraphStyle('RiskHigh', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#c2410c')),
        'risk_med': ParagraphStyle('RiskMed', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#854d0e')),
        'risk_low': ParagraphStyle('RiskLow', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#15803d')),
        'callout': ParagraphStyle('Callout', fontName='Helvetica-Oblique', fontSize=8.5, leading=12, textColor=colors.HexColor('#1e293b'))
    }

def make_callout_box(text, category="RISK OBSERVATION", border_color="#e2e8f0", bg_color="#f8fafc", text_color="#1e293b"):
    st = get_base_styles()
    title_p = Paragraph(f"<b>[ {category} ]</b>", ParagraphStyle('CP', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor('#1e3a8a')))
    content_p = Paragraph(text, ParagraphStyle('CT', fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor(text_color)))
    t = Table([[title_p], [content_p]], colWidths=[504])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(bg_color)),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LINELEFT', (0, 0), (0, -1), 3.5, colors.HexColor("#2563eb")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor(border_color)),
    ]))
    return t

# -------------------------------------------------------------
# PDF 2: Solar Tech & Smart Inverters (CleanTech)
# -------------------------------------------------------------
def build_solar_tech_pdf(output_path: str):
    doc = SimpleDocTemplate(output_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
    st = get_base_styles()
    story = []

    # Page 1
    story.append(Paragraph("CREDIT APPRAISAL DOSSIER & EXPANSION DPR  •  APP-KR-BLR-2024-9102", st['badge']))
    story.append(Paragraph("Surya Prakash Solar Tech Solutions Pvt. Ltd.", st['title']))
    story.append(Paragraph("Commercial Solar Rooftop Installations & Smart Grid Inverter Manufacturing", st['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=12))

    meta = [
        [Paragraph("Enterprise Category", st['table_cell_bold']), Paragraph("Small Manufacturing Enterprise", st['table_cell']),
         Paragraph("Date of Incorporation", st['table_cell_bold']), Paragraph("14th November 2017", st['table_cell'])],
        [Paragraph("Udyam Registration", st['table_cell_bold']), Paragraph("UDYAM-KR-03-0048192", st['table_cell']),
         Paragraph("Operating Location", st['table_cell_bold']), Paragraph("Peenya Industrial Estate, Phase II, Bengaluru", st['table_cell'])],
        [Paragraph("Primary Activity", st['table_cell_bold']), Paragraph("Solar PCU & Hybrid Inverter Assembly", st['table_cell']),
         Paragraph("Appraisal Purpose", st['table_cell_bold']), Paragraph("₹50.00 Lakhs Term Loan + CC Renewal", st['table_cell'])],
        [Paragraph("Promoter Profile", st['table_cell_bold']), Paragraph("K. Prakash Rao (B.Tech Electrical, 14 yrs exp)", st['table_cell']),
         Paragraph("Banking Relationship", st['table_cell_bold']), Paragraph("State Bank of India, SME Peenya", st['table_cell'])]
    ]
    t_meta = Table(meta, colWidths=[110, 142, 110, 142])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    story.append(Paragraph("1. Executive Summary & Enterprise Background", st['h1']))
    story.append(Paragraph(
        "Surya Prakash Solar Tech Solutions Pvt. Ltd. is a fast-growing clean-tech manufacturing firm specializing in "
        "hybrid solar power conditioning units (PCUs), micro-inverters, and commercial solar rooftop electrical panels. "
        "The enterprise caters to commercial EPC contractors, industrial factories, and decentralized rooftop solar developers across Southern India. "
        "Audited operational revenue grew from ₹180.50 Lakhs (FY23) to ₹245.80 Lakhs (FY24), sustaining a healthy operating EBITDA margin of 18.5% "
        "and net profit after tax of ₹15.20 Lakhs.", st['body']
    ))
    story.append(Paragraph(
        "The company is currently seeking a commercial term loan facility of ₹50.00 Lakhs to procure a high-speed automated SMD pick-and-place "
        "inverter PCB assembly line (total project cost ₹65.00 Lakhs). This detailed appraisal dossier provides forensic evaluation of the company's "
        "operational throughput, revenue dispersion, working capital liquidity, and regulatory covenant compliance.", st['body']
    ))
    story.append(Spacer(1, 10))
    story.append(make_callout_box(
        "APPRAISAL FINDING: Enterprise demonstrates strong 36.2% YoY revenue growth and healthy product margins (EBITDA 18.5%). "
        "However, debt liquidity is severely constrained by concentrated EPC debtor cycles and elevated Cash Credit drawing power utilization.",
        category="PRELIMINARY RISK OVERVIEW"
    ))
    story.append(PageBreak())

    # Page 2: Financial Performance
    story.append(Paragraph("2. Financial Performance & Historical Statements", st['h1']))
    story.append(Paragraph("Audited figures for FY22, FY23, and FY24 extracted from certified balance sheet filings (Amount in ₹ Lakhs):", st['body']))

    fin_data = [
        [Paragraph("Financial Metric (₹ Lakhs)", st['table_header']), Paragraph("FY 2021-22", st['table_header']), Paragraph("FY 2022-23", st['table_header']), Paragraph("FY 2023-24", st['table_header']), Paragraph("YoY Change", st['table_header'])],
        [Paragraph("Gross Revenue from Operations", st['table_cell_bold']), Paragraph("135.20", st['table_cell']), Paragraph("180.50", st['table_cell']), Paragraph("245.80", st['table_cell']), Paragraph("+36.18%", st['table_cell_bold'])],
        [Paragraph("Cost of Components & Silicon Raw Materials", st['table_cell']), Paragraph("88.40", st['table_cell']), Paragraph("118.20", st['table_cell']), Paragraph("158.40", st['table_cell']), Paragraph("+34.01%", st['table_cell'])],
        [Paragraph("Gross Operating Margin", st['table_cell_bold']), Paragraph("46.80 (34.6%)", st['table_cell']), Paragraph("62.30 (34.5%)", st['table_cell']), Paragraph("87.40 (35.6%)", st['table_cell']), Paragraph("+40.29%", st['table_cell_bold'])],
        [Paragraph("Operating EBITDA", st['table_cell']), Paragraph("22.10 (16.3%)", st['table_cell']), Paragraph("31.40 (17.4%)", st['table_cell']), Paragraph("45.47 (18.5%)", st['table_cell']), Paragraph("+44.81%", st['table_cell'])],
        [Paragraph("Net Profit After Tax (PAT)", st['table_cell_bold']), Paragraph("7.80 (5.8%)", st['table_cell']), Paragraph("11.10 (6.1%)", st['table_cell']), Paragraph("15.20 (6.2%)", st['table_cell']), Paragraph("+36.94%", st['table_cell_bold'])],
        [Paragraph("Tangible Net Worth (TNW)", st['table_cell']), Paragraph("42.50", st['table_cell']), Paragraph("53.60", st['table_cell']), Paragraph("68.80", st['table_cell']), Paragraph("+28.36%", st['table_cell'])],
        [Paragraph("Debt Service Coverage Ratio (DSCR)", st['table_cell_bold']), Paragraph("1.85x", st['table_cell']), Paragraph("1.98x", st['table_cell']), Paragraph("2.05x", st['table_cell']), Paragraph("Comfortable", st['table_cell_bold'])],
    ]
    t_fin = Table(fin_data, colWidths=[184, 80, 80, 80, 80])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 14))

    story.append(Paragraph("3. Customer Concentration & Off-taker Schedule", st['h1']))
    story.append(Paragraph("Schedule of institutional sales distribution reveals significant concentration exposure:", st['body']))

    cust_data = [
        [Paragraph("Customer / Account Name", st['table_header']), Paragraph("Turnover Share", st['table_header']), Paragraph("FY24 Value", st['table_header']), Paragraph("Agreed Terms", st['table_header']), Paragraph("Actual Realization", st['table_header'])],
        [Paragraph("Apex EPC Infra Projects Pvt. Ltd.", st['table_cell_bold']), Paragraph("42.50%", st['risk_crit']), Paragraph("₹104.46 L", st['table_cell_bold']), Paragraph("30 Days", st['table_cell']), Paragraph("92 Days Delay", st['risk_crit'])],
        [Paragraph("SunRay Green Energy Installations", st['table_cell']), Paragraph("22.10%", st['risk_med']), Paragraph("₹54.32 L", st['table_cell']), Paragraph("30 Days", st['table_cell']), Paragraph("45 Days", st['table_cell'])],
        [Paragraph("Karnataka Industrial Rooftop Developers", st['table_cell']), Paragraph("16.80%", st['table_cell']), Paragraph("₹41.29 L", st['table_cell']), Paragraph("15 Days", st['table_cell']), Paragraph("28 Days", st['table_cell'])],
        [Paragraph("Retail Dealers & Distributors (22 Accounts)", st['table_cell']), Paragraph("18.60%", st['table_cell']), Paragraph("₹45.73 L", st['table_cell']), Paragraph("Advance / 7 D", st['table_cell']), Paragraph("10 Days", st['table_cell'])],
    ]
    t_cust = Table(cust_data, colWidths=[174, 80, 75, 85, 90])
    t_cust.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_cust)
    story.append(Spacer(1, 10))
    story.append(make_callout_box(
        "CRITICAL RISK SIGNAL: Single customer 'Apex EPC Infra Projects Pvt. Ltd.' generates 42.5% of total enterprise sales. "
        "Contractor delays payment settlements to 92 days vs 30-day agreement, freezing ₹26.5 Lakhs in liquid cash flow.",
        category="CUSTOMER CONCENTRATION HAZARD", border_color="#fca5a5", bg_color="#fff1f2", text_color="#991b1b"
    ))
    story.append(PageBreak())

    # Page 3: Working Capital & Operational Bottleneck
    story.append(Paragraph("4. Working Capital Stress & Banking Utilization", st['h1']))
    story.append(Paragraph(
        "The enterprise maintains a Cash Credit working capital limit of ₹50.00 Lakhs with State Bank of India. "
        "Due to prolonged receivables stretch from Apex EPC Infra (92 days) combined with advance procurement requirements for semiconductor micro-controllers, "
        "the facility currently operates at a peak utilization of 94.2% (average utilization 91.5% over trailing 6 months).", st['body']
    ))
    story.append(Paragraph(
        "This leaves the company with less than ₹2.90 Lakhs in undrawn contingency buffer. Operating near 100% drawing power limits exposure "
        "to unexpected supply chain spikes and subjects the company to monthly bank penal interest overheads.", st['body']
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("5. Operational Machinery & Throughput Bottleneck", st['h1']))
    story.append(Paragraph(
        "The manufacturing facility operates semi-automatic wave soldering and manual component insertion stations. "
        "Operational bottleneck: The inverter testing and quality burn-in rig capacity limits factory throughput to 150 units/month, "
        "while active monthly EPC order intake averages 280-320 units. "
        "Consequently, assembled inverter chassis remain staged in warehouse buffer for up to 3 weeks awaiting testing slots, "
        "delaying dispatch billing and creating inventory lockup.", st['body']
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("6. Regulatory Compliance & Capital Expenditure Shortfall", st['h1']))
    story.append(Paragraph(
        "Statutory compliance review notes an unmitigated compliance gap: The factory shed expansion constructed in Q2 FY24 currently lacks updated "
        "Karnataka State Pollution Control Board (KSPCB) Consent to Operate (CTO) renewal for the electronic soldering extraction exhaust. "
        "Commercial lenders stipulate unconditional PCB clearance prior to first loan disbursement.", st['body']
    ))
    story.append(Paragraph(
        "Furthermore, the proposed capital expenditure of ₹65.00 Lakhs for automated SMD machinery requires a mandatory 30% promoter contribution "
        "of ₹20.00 Lakhs. Promoters have allocated ₹13.50 Lakhs from internal reserves, leaving an uncovered promoter equity shortfall of ₹6.50 Lakhs.", st['body']
    ))
    story.append(Spacer(1, 14))

    story.append(make_callout_box(
        "RECOMMENDED ACTION BLUEPRINT: 1. Deploy TReDS bill discounting on Apex EPC Infra invoices to release ₹22 Lakhs; "
        "2. Regularize KSPCB consent renewal within 30 days; 3. Bridge ₹6.50 Lakhs promoter margin gap via subordinate debt to unlock ₹50 Lakhs term loan.",
        category="STRATEGIC REMEDIATION"
    ))

    doc.build(story, canvasmaker=create_canvas_factory("Surya Prakash Solar Tech Solutions Pvt. Ltd.", "UDYAM-KR-03-0048192"))
    print(f"Generated: {output_path}")

# -------------------------------------------------------------
# PDF 3: Precision Engineering & Auto Components
# -------------------------------------------------------------
def build_precision_engineering_pdf(output_path: str):
    doc = SimpleDocTemplate(output_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
    st = get_base_styles()
    story = []

    # Page 1
    story.append(Paragraph("CREDIT APPRAISAL DOSSIER & TERM LOAN PROPOSAL  •  APP-TN-CHN-2024-5519", st['badge']))
    story.append(Paragraph("Kavitha Precision CNC Engineering Works Pvt. Ltd.", st['title']))
    story.append(Paragraph("Automotive Machined Fasteners & CNC High-Precision Turned Components", st['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=12))

    meta = [
        [Paragraph("Enterprise Category", st['table_cell_bold']), Paragraph("Small Manufacturing Enterprise", st['table_cell']),
         Paragraph("Date of Incorporation", st['table_cell_bold']), Paragraph("8th March 2016", st['table_cell'])],
        [Paragraph("Udyam Registration", st['table_cell_bold']), Paragraph("UDYAM-TN-02-0031854", st['table_cell']),
         Paragraph("Operating Location", st['table_cell_bold']), Paragraph("SIDCO Industrial Estate, Ambattur, Chennai", st['table_cell'])],
        [Paragraph("Primary Activity", st['table_cell_bold']), Paragraph("Automotive Machining & Spline Shafts", st['table_cell']),
         Paragraph("Appraisal Purpose", st['table_cell_bold']), Paragraph("₹35.00 Lakhs 5-Axis CNC Term Loan", st['table_cell'])],
        [Paragraph("Managing Director", st['table_cell_bold']), Paragraph("R. Senthamarai Kannan (DME, 22 yrs exp)", st['table_cell']),
         Paragraph("Banking Partner", st['table_cell_bold']), Paragraph("Indian Overseas Bank, Ambattur Branch", st['table_cell'])]
    ]
    t_meta = Table(meta, colWidths=[110, 142, 110, 142])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    story.append(Paragraph("1. Executive Summary & Manufacturing Profile", st['h1']))
    story.append(Paragraph(
        "Kavitha Precision CNC Engineering Works Pvt. Ltd. is a specialized automotive machining vendor located in the "
        "Ambattur industrial belt of Chennai. The company produces high-precision transmission spline shafts, suspension pins, and critical "
        "machined fasteners for Tier-1 automotive component conglomerates supplying OEMs such as Hyundai, Royal Enfield, and Ashok Leyland. "
        "Audited operational turnover grew from ₹140.20 Lakhs (FY23) to ₹188.40 Lakhs (FY24), with net profit margin of 6.2% (PAT ₹11.68 Lakhs).", st['body']
    ))
    story.append(Paragraph(
        "The firm plans to acquire an advanced 5-axis CNC machining center (total capital outlay ₹52.00 Lakhs) to secure export tier-1 orders. "
        "This credit appraisal reviews customer concentration risks, CNC machine idle time, working capital overdraft utilization, "
        "and statutory ISO calibration compliance.", st['body']
    ))
    story.append(Spacer(1, 10))
    story.append(make_callout_box(
        "APPRAISAL FINDING: Robust tier-1 automotive order book with ₹45 Lakhs unbilled purchase orders. "
        "Key vulnerability: 46.8% revenue dependency on Lucas-TVS auto cluster and 91% working capital facility utilization.",
        category="PRELIMINARY RISK OVERVIEW"
    ))
    story.append(PageBreak())

    # Page 2: Financials & Concentration
    story.append(Paragraph("2. Audited Financial Statements (FY22 - FY24)", st['h1']))
    fin_data = [
        [Paragraph("Financial Metric (₹ Lakhs)", st['table_header']), Paragraph("FY 2021-22", st['table_header']), Paragraph("FY 2022-23", st['table_header']), Paragraph("FY 2023-24", st['table_header']), Paragraph("Performance", st['table_header'])],
        [Paragraph("Operational Revenue", st['table_cell_bold']), Paragraph("108.50", st['table_cell']), Paragraph("140.20", st['table_cell']), Paragraph("188.40", st['table_cell']), Paragraph("+34.38% YoY", st['table_cell_bold'])],
        [Paragraph("Raw Material Cost (Alloy Steel)", st['table_cell']), Paragraph("56.40", st['table_cell']), Paragraph("74.30", st['table_cell']), Paragraph("98.10", st['table_cell']), Paragraph("+32.03%", st['table_cell'])],
        [Paragraph("Operating EBITDA", st['table_cell_bold']), Paragraph("18.40 (16.9%)", st['table_cell']), Paragraph("24.80 (17.7%)", st['table_cell']), Paragraph("33.91 (18.0%)", st['table_cell']), Paragraph("+36.73%", st['table_cell_bold'])],
        [Paragraph("Net Profit After Tax", st['table_cell']), Paragraph("6.50 (6.0%)", st['table_cell']), Paragraph("8.60 (6.1%)", st['table_cell']), Paragraph("11.68 (6.2%)", st['table_cell']), Paragraph("+35.81%", st['table_cell'])],
        [Paragraph("Tangible Net Worth", st['table_cell_bold']), Paragraph("34.10", st['table_cell']), Paragraph("42.70", st['table_cell']), Paragraph("54.38", st['table_cell']), Paragraph("Solid", st['table_cell_bold'])],
        [Paragraph("Debt Service Coverage Ratio", st['table_cell']), Paragraph("1.72x", st['table_cell']), Paragraph("1.80x", st['table_cell']), Paragraph("1.88x", st['table_cell']), Paragraph("Above 1.5x Norm", st['table_cell'])],
    ]
    t_fin = Table(fin_data, colWidths=[184, 80, 80, 80, 80])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 14))

    story.append(Paragraph("3. Customer Dependency & Tier-1 Off-taker Concentration", st['h1']))
    cust_data = [
        [Paragraph("OEM / Tier-1 Vendor", st['table_header']), Paragraph("Share (%)", st['table_header']), Paragraph("FY24 Value", st['table_header']), Paragraph("Terms", st['table_header']), Paragraph("Settlement Days", st['table_header'])],
        [Paragraph("Lucas TVS Automotive Vendor Cluster", st['table_cell_bold']), Paragraph("46.80%", st['risk_crit']), Paragraph("₹88.17 L", st['table_cell_bold']), Paragraph("45 Days", st['table_cell']), Paragraph("84 Days Realization", st['risk_crit'])],
        [Paragraph("Sundram Fasteners Allied Ancillary", st['table_cell']), Paragraph("24.50%", st['risk_med']), Paragraph("₹46.16 L", st['table_cell']), Paragraph("30 Days", st['table_cell']), Paragraph("52 Days", st['table_cell'])],
        [Paragraph("Brakes India Tier-2 Machining Pool", st['table_cell']), Paragraph("15.20%", st['table_cell']), Paragraph("₹28.64 L", st['table_cell']), Paragraph("30 Days", st['table_cell']), Paragraph("38 Days", st['table_cell'])],
        [Paragraph("General Industrial Machine Shops", st['table_cell']), Paragraph("13.50%", st['table_cell']), Paragraph("₹25.43 L", st['table_cell']), Paragraph("15 Days", st['table_cell']), Paragraph("20 Days", st['table_cell'])],
    ]
    t_cust = Table(cust_data, colWidths=[174, 80, 75, 85, 90])
    t_cust.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_cust)
    story.append(Spacer(1, 10))
    story.append(make_callout_box(
        "CUSTOMER RISK HAZARD: The top tier-1 account commands 46.8% of total billings with an 84-day debtor realization cycle. "
        "Cash flow is vulnerable to OEM production line model changes or automotive supply chain strikes.",
        category="CUSTOMER CONCENTRATION HAZARD", border_color="#fca5a5", bg_color="#fff1f2", text_color="#991b1b"
    ))
    story.append(PageBreak())

    # Page 3: Working Capital, Operational Idle Time & Capex
    story.append(Paragraph("4. Cash Credit Working Capital Strains", st['h1']))
    story.append(Paragraph(
        "The company holds a sanctioned Cash Credit facility of ₹30.00 Lakhs. "
        "Due to 84-day realization delays from Lucas-TVS combined with upfront payments to steel stockists, "
        "drawing power utilization has reached 91.0%, leaving a thin liquidity buffer of under ₹2.70 Lakhs.", st['body']
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("5. Operational Constraint: CNC Machine Idle Time", st['h1']))
    story.append(Paragraph(
        "Operational bottleneck: CNC machine logs reveal 18% idle time across two 4-axis machining centers. "
        "This downtime is caused by a persistent shortage of certified CAM programming technicians and shift machine operators. "
        "The inability to operate full 3-shift schedules limits gross shopfloor output and inflates hourly machine overheads.", st['body']
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("6. Quality Certification Deficit & Project Capex Gap", st['h1']))
    story.append(Paragraph(
        "Statutory compliance review flags that the periodic NABL calibration certification for precision coordinate measuring machines (CMM) "
        "and micrometer gauges expired in August 2024 and is pending renewal. Automotive customers mandate up-to-date NABL audit reports.", st['body']
    ))
    story.append(Paragraph(
        "The proposed ₹52.00 Lakhs capex requires ₹17.00 Lakhs promoter margin contribution. Committed promoter equity is ₹12.00 Lakhs, "
        "creating a promoter equity shortfall of ₹5.00 Lakhs that must be regularized prior to bank sanction letter issuance.", st['body']
    ))
    story.append(Spacer(1, 14))
    story.append(make_callout_box(
        "RECOMMENDED ACTION BLUEPRINT: 1. Regularize NABL instrument calibration within 15 days; "
        "2. Contract apprenticeship partnership with NTTF/ITI Ambattur to eliminate 18% CNC idle time; "
        "3. Introduce invoice discounting on Lucas-TVS receivables to reduce CC utilization below 70%.",
        category="STRATEGIC REMEDIATION"
    ))

    doc.build(story, canvasmaker=create_canvas_factory("Kavitha Precision CNC Engineering Works Pvt. Ltd.", "UDYAM-TN-02-0031854"))
    print(f"Generated: {output_path}")

# -------------------------------------------------------------
# PDF 4: Textiles & Garment Exports
# -------------------------------------------------------------
def build_textiles_export_pdf(output_path: str):
    doc = SimpleDocTemplate(output_path, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=54, bottomMargin=54)
    st = get_base_styles()
    story = []

    # Page 1
    story.append(Paragraph("CREDIT APPRAISAL DOSSIER & GREEN CAPEX DPR  •  APP-TN-TPR-2024-3882", st['badge']))
    story.append(Paragraph("Sri Lakshmi Knits & Garment Exports LLP", st['title']))
    story.append(Paragraph("Export-Oriented Knitted Cotton Garments & Sustainable Home Textiles", st['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=12))

    meta = [
        [Paragraph("Enterprise Category", st['table_cell_bold']), Paragraph("Small Manufacturing Enterprise", st['table_cell']),
         Paragraph("Date of Formation", st['table_cell_bold']), Paragraph("21st June 2015", st['table_cell'])],
        [Paragraph("Udyam Registration", st['table_cell_bold']), Paragraph("UDYAM-TN-24-0072911", st['table_cell']),
         Paragraph("Operating Location", st['table_cell_bold']), Paragraph("Netaji Apparel Park, Avinashi Road, Tiruppur", st['table_cell'])],
        [Paragraph("Primary Activity", st['table_cell_bold']), Paragraph("Knitted Garment Stitching & Export", st['table_cell']),
         Paragraph("Appraisal Purpose", st['table_cell_bold']), Paragraph("₹30.00 Lakhs Green Energy Term Loan", st['table_cell'])],
        [Paragraph("Designated Partner", st['table_cell_bold']), Paragraph("M. Balasubramaniam (25 yrs textile exp)", st['table_cell']),
         Paragraph("Lead Banker", st['table_cell_bold']), Paragraph("Canara Bank, Tiruppur Overseas Branch", st['table_cell'])]
    ]
    t_meta = Table(meta, colWidths=[110, 142, 110, 142])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    story.append(Paragraph("1. Executive Summary & Export Operations", st['h1']))
    story.append(Paragraph(
        "Sri Lakshmi Knits & Garment Exports LLP is an established export-oriented garment manufacturing unit in Tiruppur, "
        "the knitwear capital of India. The enterprise specializes in high-value organic cotton infant-wear, circular-knitted t-shirts, "
        "and sustainable home furnishings shipped primarily to European and UK retail apparel chains. "
        "Audited operational revenue grew from ₹240.00 Lakhs (FY23) to ₹315.00 Lakhs (FY24), with net profit margin of 7.0% (PAT ₹22.05 Lakhs).", st['body']
    ))
    story.append(Paragraph(
        "The firm is seeking a green term loan facility of ₹30.00 Lakhs to install a 100 kW captive rooftop solar photovoltaic plant (total capex ₹42.00 Lakhs) "
        "to mitigate high industrial grid electricity tariffs and meet European buyer ESG supply chain criteria. "
        "This dossier audits export buyer concentration, cotton yarn inventory lockup, Zero Liquid Discharge (ZLD) effluent compliance, "
        "and capital structure.", st['body']
    ))
    story.append(Spacer(1, 10))
    story.append(make_callout_box(
        "APPRAISAL FINDING: Verified direct export track record with high European customer retention. "
        "Operational hazards include 78-day cotton inventory lockup, 88-day export LC realization, and unmitigated state effluent audit regularisation.",
        category="PRELIMINARY RISK OVERVIEW"
    ))
    story.append(PageBreak())

    # Page 2: Financials & Export Concentration
    story.append(Paragraph("2. Financial Performance & Export Turnover (FY22 - FY24)", st['h1']))
    fin_data = [
        [Paragraph("Financial Metric (₹ Lakhs)", st['table_header']), Paragraph("FY 2021-22", st['table_header']), Paragraph("FY 2022-23", st['table_header']), Paragraph("FY 2023-24", st['table_header']), Paragraph("YoY Trend", st['table_header'])],
        [Paragraph("Export Sales Revenue", st['table_cell_bold']), Paragraph("195.00", st['table_cell']), Paragraph("240.00", st['table_cell']), Paragraph("315.00", st['table_cell']), Paragraph("+31.25%", st['table_cell_bold'])],
        [Paragraph("Raw Cotton Yarn Consumption", st['table_cell']), Paragraph("105.00", st['table_cell']), Paragraph("132.00", st['table_cell']), Paragraph("176.40", st['table_cell']), Paragraph("+33.64%", st['table_cell'])],
        [Paragraph("Operating EBITDA", st['table_cell_bold']), Paragraph("33.15 (17.0%)", st['table_cell']), Paragraph("42.00 (17.5%)", st['table_cell']), Paragraph("56.70 (18.0%)", st['table_cell']), Paragraph("+35.00%", st['table_cell_bold'])],
        [Paragraph("Net Profit After Tax", st['table_cell']), Paragraph("12.68 (6.5%)", st['table_cell']), Paragraph("16.32 (6.8%)", st['table_cell']), Paragraph("22.05 (7.0%)", st['table_cell']), Paragraph("+35.11%", st['table_cell'])],
        [Paragraph("Tangible Net Worth", st['table_cell_bold']), Paragraph("58.20", st['table_cell']), Paragraph("72.50", st['table_cell']), Paragraph("91.80", st['table_cell']), Paragraph("+26.62%", st['table_cell_bold'])],
        [Paragraph("Debt Service Coverage Ratio", st['table_cell']), Paragraph("2.10x", st['table_cell']), Paragraph("2.18x", st['table_cell']), Paragraph("2.25x", st['table_cell']), Paragraph("Healthy", st['table_cell'])],
    ]
    t_fin = Table(fin_data, colWidths=[184, 80, 80, 80, 80])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 14))

    story.append(Paragraph("3. Export Customer Schedule & Buyer Concentration", st['h1']))
    cust_data = [
        [Paragraph("Buyer / Retail Chain", st['table_header']), Paragraph("Share (%)", st['table_header']), Paragraph("FY24 Value", st['table_header']), Paragraph("LC Period", st['table_header']), Paragraph("Payment Realization", st['table_header'])],
        [Paragraph("EuroTextile Retail GmbH (Germany)", st['table_cell_bold']), Paragraph("39.50%", st['risk_crit']), Paragraph("₹124.42 L", st['table_cell_bold']), Paragraph("60 Days LC", st['table_cell']), Paragraph("88 Days Delay", st['risk_crit'])],
        [Paragraph("Nordic Fashion Buying Group (Denmark)", st['table_cell']), Paragraph("26.80%", st['risk_med']), Paragraph("₹84.42 L", st['table_cell']), Paragraph("60 Days LC", st['table_cell']), Paragraph("65 Days", st['table_cell'])],
        [Paragraph("HighStreet Apparel Sourcing Ltd (UK)", st['table_cell']), Paragraph("18.70%", st['table_cell']), Paragraph("₹58.90 L", st['table_cell']), Paragraph("30 Days TT", st['table_cell']), Paragraph("35 Days", st['table_cell'])],
        [Paragraph("Domestic Corporate Brand Buyers", st['table_cell']), Paragraph("15.00%", st['table_cell']), Paragraph("₹47.25 L", st['table_cell']), Paragraph("15 Days", st['table_cell']), Paragraph("20 Days", st['table_cell'])],
    ]
    t_cust = Table(cust_data, colWidths=[174, 80, 75, 85, 90])
    t_cust.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_cust)
    story.append(Spacer(1, 10))
    story.append(make_callout_box(
        "EXPORT CONCENTRATION ALERT: German retail client commands 39.5% of total sales. "
        "Letter of Credit payment realization stretches to 88 days, locking ₹32 Lakhs in operating liquidity.",
        category="CUSTOMER CONCENTRATION HAZARD", border_color="#fca5a5", bg_color="#fff1f2", text_color="#991b1b"
    ))
    story.append(PageBreak())

    # Page 3: Working Capital, Effluent Compliance & Solar Capex
    story.append(Paragraph("4. Working Capital & Inventory Lockup", st['h1']))
    story.append(Paragraph(
        "The firm maintains an Export Packing Credit (EPC) and Cash Credit facility of ₹45.00 Lakhs. "
        "Due to raw cotton price volatility, the firm maintains 78 days of cotton yarn buffer inventory (₹38.5 Lakhs locked). "
        "Coupled with 88-day LC realization intervals, credit limit utilization stands at 92.8%, creating working capital strain during peak seasonal shipments.", st['body']
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("5. Operational Overhead: High Grid Electricity Tariffs", st['h1']))
    story.append(Paragraph(
        "Operational bottleneck: Industrial high-tension power tariffs (TANGEDCO) have surged to ₹9.20 per kWh, consuming 4.8% of gross revenues. "
        "Installing the proposed 100 kW captive rooftop solar plant will slash energy expenses by ₹1.25 Lakhs per month and qualify the enterprise "
        "for zero-carbon apparel supplier certification.", st['body']
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph("6. Environmental Statutory Compliance & Capex Deficit", st['h1']))
    story.append(Paragraph(
        "Statutory compliance review identifies that the mandatory annual Zero Liquid Discharge (ZLD) effluent audit verification "
        "for the contracted wet-processing dyeing unit is pending submission to the Tamil Nadu Pollution Control Board (TNPCB). "
        "Commercial export lenders mandate zero-liquid discharge compliance certification.", st['body']
    ))
    story.append(Paragraph(
        "Total solar capital investment is ₹42.00 Lakhs, requiring ₹12.00 Lakhs promoter contribution. "
        "Committed promoter equity is ₹7.50 Lakhs, leaving an uncovered promoter equity shortfall of ₹4.50 Lakhs.", st['body']
    ))
    story.append(Spacer(1, 14))
    story.append(make_callout_box(
        "RECOMMENDED ACTION BLUEPRINT: 1. Regularize TNPCB ZLD effluent audit within 30 days; "
        "2. Leverage MSME credit guarantee scheme for green energy to bridge ₹4.50 Lakhs margin gap; "
        "3. Onboard EuroTextile receivables onto international export factoring to liberate ₹25 Lakhs liquidity.",
        category="STRATEGIC REMEDIATION"
    ))

    doc.build(story, canvasmaker=create_canvas_factory("Sri Lakshmi Knits & Garment Exports LLP", "UDYAM-TN-24-0072911"))
    print(f"Generated: {output_path}")

def generate_all():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sample_dir = os.path.join(base_dir, "sample-data")
    os.makedirs(sample_dir, exist_ok=True)

    # 1. Regenerate existing demo document (Sri Murugan Agro Foods)
    import scripts.generate_demo_pdf as agro_gen
    agro_path_demo = os.path.join(sample_dir, "demo-document.pdf")
    agro_path_opt1 = os.path.join(sample_dir, "01_agro_foods_credit_appraisal.pdf")
    agro_gen.build_professional_pdf(agro_path_demo)
    agro_gen.build_professional_pdf(agro_path_opt1)
    print(f"Option 1 Generated: {agro_path_demo} and {agro_path_opt1}")

    # 2. Solar CleanTech
    solar_path = os.path.join(sample_dir, "02_solar_tech_expansion_dpr.pdf")
    build_solar_tech_pdf(solar_path)

    # 3. Precision CNC Engineering
    cnc_path = os.path.join(sample_dir, "03_precision_engineering_term_loan.pdf")
    build_precision_engineering_pdf(cnc_path)

    # 4. Textiles & Garment Exports
    tex_path = os.path.join(sample_dir, "04_textiles_export_credit_dossier.pdf")
    build_textiles_export_pdf(tex_path)

    print("\n[SUCCESS] All 4 Executive PDF Options Generated Successfully in sample-data/!")

if __name__ == "__main__":
    generate_all()
