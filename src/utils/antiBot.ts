import CryptoJS from 'crypto-js';

interface BotCheckResult {
  isBot: boolean;
  reason?: string;
}

export class AntiBotProtection {
  private static instance: AntiBotProtection;
  private fingerprint: string = '';
  private lastActionTime: number = 0;
  private mouseMovements: number = 0;
  private keyPresses: number = 0;
  private scrollEvents: number = 0;
  private touchEvents: number = 0;
  private lastMousePositions: Array<[number, number]> = [];
  private deviceMotionEvents: number = 0;

  private constructor() {
    this.initializeFingerprint();
    this.setupEventListeners();
  }

  public static getInstance(): AntiBotProtection {
    if (!AntiBotProtection.instance) {
      AntiBotProtection.instance = new AntiBotProtection();
    }
    return AntiBotProtection.instance;
  }

  private async initializeFingerprint(): Promise<void> {
    try {
      const components = await this.getDeviceComponents();
      const rawFingerprint = Object.values(components).join('|');
      this.fingerprint = CryptoJS.SHA256(rawFingerprint).toString();
    } catch {
      /* ignore */
    }
  }

  private async getDeviceComponents(): Promise<Record<string, any>> {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      colorDepth: screen.colorDepth,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      screenResolution: `${screen.width},${screen.height}`,
      availableScreenResolution: `${screen.availWidth},${screen.availHeight}`,
      timezoneOffset: new Date().getTimezoneOffset(),
      sessionStorage: !!window.sessionStorage,
      localStorage: !!window.localStorage,
      indexedDb: !!window.indexedDB,
      cpuClass: (navigator as any).cpuClass,
      platform: navigator.platform,
      plugins: this.getPlugins(),
      canvas: this.getCanvasFingerprint(),
      webgl: await this.getWebglFingerprint(),
      webglVendor: this.getWebglVendor(),
      adBlock: await this.checkAdBlock(),
      touchSupport: this.getTouchSupport(),
      fonts: await this.getFonts(),
      audio: await this.getAudioFingerprint(),
    };
  }

  private setupEventListeners(): void {
    let lastMouseEvent: MouseEvent;

    document.addEventListener('mousemove', (e) => {
      this.mouseMovements++;
      if (lastMouseEvent) {
        const speed = Math.sqrt(
          Math.pow(e.clientX - lastMouseEvent.clientX, 2) +
            Math.pow(e.clientY - lastMouseEvent.clientY, 2)
        );
        if (speed > 0) {
          this.lastMousePositions.push([e.clientX, e.clientY]);
          if (this.lastMousePositions.length > 10) this.lastMousePositions.shift();
        }
      }
      lastMouseEvent = e;
    });

    document.addEventListener('keydown', () => {
      const t = Date.now() - this.lastActionTime;
      if (t > 10) {
        this.keyPresses++;
        this.lastActionTime = Date.now();
      }
    });

    document.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - this.lastActionTime > 50) {
        this.scrollEvents++;
        this.lastActionTime = now;
      }
    });

    document.addEventListener('touchstart', () => this.touchEvents++);
    document.addEventListener('touchmove', () => this.touchEvents++);
    document.addEventListener('touchend', () => this.touchEvents++);

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', () => this.deviceMotionEvents++);
    }

    setInterval(() => this.resetCounters(), 30000);
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const ctx = new OfflineAudioContext(1, 5000, 44100);
      const osc = ctx.createOscillator();
      const comp = ctx.createDynamicsCompressor();
      osc.type = 'triangle';
      osc.frequency.value = 1e4;
      osc.connect(comp);
      comp.connect(ctx.destination);
      osc.start(0);
      const result = await Promise.race([
        ctx.startRendering().then((buf) => {
          const data = buf.getChannelData(0);
          let sum = 0;
          for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
          return sum.toString(36);
        }),
        new Promise<string>((resolve) => setTimeout(() => resolve('audio-timeout'), 3000)),
      ]);
      return result;
    } catch {
      return 'audio-failed';
    }
  }

  private async getFonts(): Promise<string> {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const fontList = ['Arial', 'Courier', 'Georgia', 'Times New Roman', 'Verdana'];
    const h = document.getElementsByTagName('body')[0];
    const s = document.createElement('span');
    s.style.fontSize = '72px';
    s.innerHTML = 'mmmmmmmmmmlli';
    const dw: Record<string, number> = {};
    const dh: Record<string, number> = {};
    for (const bf of baseFonts) {
      s.style.fontFamily = bf;
      h.appendChild(s);
      dw[bf] = s.offsetWidth;
      dh[bf] = s.offsetHeight;
      h.removeChild(s);
    }
    const detected: string[] = [];
    for (const font of fontList) {
      for (const bf of baseFonts) {
        s.style.fontFamily = `${font},${bf}`;
        h.appendChild(s);
        if (s.offsetWidth !== dw[bf] || s.offsetHeight !== dh[bf]) {
          detected.push(font);
          h.removeChild(s);
          break;
        }
        h.removeChild(s);
      }
    }
    return detected.join(',');
  }

  private getPlugins(): string {
    if (navigator.plugins) {
      return Array.from(navigator.plugins)
        .map((p) =>
          [p.name, p.description, Array.from(p).map((mt) => [mt.type, mt.suffixes].join('~')).join(',')].join('::')
        )
        .join(';');
    }
    return '';
  }

  private getCanvasFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    canvas.width = 240;
    canvas.height = 140;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '11pt "Times New Roman"';
    ctx.fillText('Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18pt Arial';
    ctx.fillText('Canvas', 4, 45);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,255,0)';
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    return canvas.toDataURL();
  }

  private async getWebglFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    const g = gl as WebGLRenderingContext;
    const vb = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, vb);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]), g.STATIC_DRAW);
    const vs = g.createShader(g.VERTEX_SHADER)!;
    g.shaderSource(vs, 'attribute vec2 c;void main(){gl_Position=vec4(c,0,1);}');
    g.compileShader(vs);
    const fs = g.createShader(g.FRAGMENT_SHADER)!;
    g.shaderSource(fs, 'void main(){gl_FragColor=vec4(0,0,0,.1);}');
    g.compileShader(fs);
    const p = g.createProgram()!;
    g.attachShader(p, vs);
    g.attachShader(p, fs);
    g.linkProgram(p);
    g.useProgram(p);
    const loc = g.getAttribLocation(p, 'c');
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    g.enableVertexAttribArray(loc);
    g.drawArrays(g.TRIANGLES, 0, 3);
    return canvas.toDataURL();
  }

  private getWebglVendor(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    const g = gl as WebGLRenderingContext;
    const d = g.getExtension('WEBGL_debug_renderer_info');
    if (!d) return '';
    return g.getParameter(d.UNMASKED_VENDOR_WEBGL) + '~' + g.getParameter(d.UNMASKED_RENDERER_WEBGL);
  }

  private async checkAdBlock(): Promise<boolean> {
    const t = document.createElement('div');
    t.innerHTML = '&nbsp;';
    t.className = 'adsbox';
    document.body.appendChild(t);
    const blocked = t.offsetHeight === 0;
    document.body.removeChild(t);
    return blocked;
  }

  private getTouchSupport(): string {
    let mtp = 0;
    if (navigator.maxTouchPoints !== undefined) mtp = navigator.maxTouchPoints;
    const te = 'ontouchstart' in window;
    const ts = 'touchstart' in window;
    return `${mtp}-${te}-${ts}`;
  }

  private resetCounters(): void {
    this.mouseMovements = 0;
    this.keyPresses = 0;
    this.scrollEvents = 0;
    this.touchEvents = 0;
    this.deviceMotionEvents = 0;
    this.lastMousePositions = [];
  }

  private checkUserBehavior(): boolean {
    const total =
      this.mouseMovements + this.keyPresses + this.scrollEvents + this.touchEvents + this.deviceMotionEvents;
    if (total === 0) return true;
    if (this.lastMousePositions.length > 3) {
      let straight = 0;
      for (let i = 2; i < this.lastMousePositions.length; i++) {
        const [x1, y1] = this.lastMousePositions[i - 2];
        const [x2, y2] = this.lastMousePositions[i - 1];
        const [x3, y3] = this.lastMousePositions[i];
        const cross = Math.abs((x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2));
        if (cross < 1) straight++;
      }
      if (straight > 3) return false;
    }
    return true;
  }

  private checkHeaders(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    const bots = [
      'bot', 'crawler', 'spider', 'headless', 'selenium', 'puppeteer',
      'chrome-lighthouse', 'pagespeed', 'ptst', 'lighthouse', 'slurp',
      'phantom', 'zombie', 'nightmare', 'electron', 'cypress',
    ];
    if (bots.some((b) => ua.includes(b))) return false;
    if (!navigator.languages || navigator.languages.length === 0) return false;
    if ((navigator as any).webdriver) return false;
    return true;
  }

  public async checkForBot(): Promise<BotCheckResult> {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));
    if (!this.checkHeaders()) return { isBot: true, reason: 'Invalid user agent or headers' };
    if (!this.checkUserBehavior()) return { isBot: true, reason: 'Suspicious behavior patterns' };
    if (!this.fingerprint) return { isBot: true, reason: 'Failed to generate fingerprint' };
    return { isBot: false };
  }

  public getToken(): string {
    const timestamp = Date.now().toString();
    const noise = Math.random().toString(36).substring(2);
    const data = `${this.fingerprint}:${timestamp}:${noise}`;
    return CryptoJS.AES.encrypt(data, CryptoJS.SHA3(navigator.userAgent)).toString();
  }
}
