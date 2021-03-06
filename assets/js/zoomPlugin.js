/*!
 * chartjs-plugin-zoom v1.1.1
 * undefined
 * (c) 2016-2021 chartjs-plugin-zoom Contributors
 * Released under the MIT License
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t(
        require("chart.js"),
        require("hammerjs"),
        require("chart.js/helpers")
      ))
    : "function" == typeof define && define.amd
    ? define(["chart.js", "hammerjs", "chart.js/helpers"], t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).ChartZoom =
        t(e.Chart, e.Hammer, e.Chart.helpers));
})(this, function (e, t, n) {
  "use strict";
  function o(e) {
    return e && "object" == typeof e && "default" in e ? e : { default: e };
  }
  var a = o(t);
  const i = (e) => e && e.enabled && e.modifierKey,
    c = (e, t) => e && t[e + "Key"],
    r = (e, t) => e && !t[e + "Key"];
  function l(e, t, n) {
    return (
      void 0 === e ||
      ("string" == typeof e
        ? -1 !== e.indexOf(t)
        : "function" == typeof e && -1 !== e({ chart: n }).indexOf(t))
    );
  }
  function s(e, t, o) {
    const a = (function ({ x: e, y: t }, n) {
      const o = n.scales,
        a = Object.keys(o);
      for (let n = 0; n < a.length; n++) {
        const i = o[a[n]];
        if (t >= i.top && t <= i.bottom && e >= i.left && e <= i.right)
          return i;
      }
      return null;
    })(t, o);
    if (a && l(e, a.axis, o)) return [a];
    const i = [];
    return (
      n.each(o.scales, function (t) {
        l(e, t.axis, o) || i.push(t);
      }),
      i
    );
  }
  const m = new WeakMap();
  function u(e) {
    let t = m.get(e);
    return (
      t ||
        ((t = {
          originalScaleLimits: {},
          updatedScaleLimits: {},
          handlers: {},
          panDelta: {},
        }),
        m.set(e, t)),
      t
    );
  }
  function d(e, t, n) {
    const o = e.max - e.min,
      a = o * (t - 1),
      i = e.isHorizontal() ? n.x : n.y,
      c = (e.getValueForPixel(i) - e.min) / o || 0;
    return { min: a * c, max: a * (1 - c) };
  }
  function f(e, t, o, a, i) {
    let c = o[a];
    if ("original" === c) {
      const o = e.originalScaleLimits[t.id][a];
      c = n.valueOrDefault(o.options, o.scale);
    }
    return n.valueOrDefault(c, i);
  }
  function h(e, { min: t, max: n }, o, a = !1) {
    const i = u(e.chart),
      { id: c, axis: r, options: l } = e,
      s = (o && (o[c] || o[r])) || {},
      { minRange: m = 0 } = s,
      d = f(i, e, s, "min", -1 / 0),
      h = f(i, e, s, "max", 1 / 0),
      p = Math.max(t, d),
      g = Math.min(n, h),
      x = a ? Math.max(g - p, m) : e.max - e.min;
    if (g - p !== x)
      if (d > g - x) (t = p), (n = p + x);
      else if (h < p + x) (n = g), (t = g - x);
      else {
        const e = (x - g + p) / 2;
        (t = p - e), (n = g + e);
      }
    else (t = p), (n = g);
    return (
      (l.min = t),
      (l.max = n),
      (i.updatedScaleLimits[e.id] = { min: t, max: n }),
      e.parse(t) !== e.min || e.parse(n) !== e.max
    );
  }
  const p = (e) =>
    0 === e || isNaN(e)
      ? 0
      : e < 0
      ? Math.min(Math.round(e), -1)
      : Math.max(Math.round(e), 1);
  const g = {
    second: 500,
    minute: 3e4,
    hour: 18e5,
    day: 432e5,
    week: 3024e5,
    month: 1296e6,
    quarter: 5184e6,
    year: 157248e5,
  };
  function x(e, t, n, o = !1) {
    const { min: a, max: i, options: c } = e,
      r = c.time && c.time.round,
      l = g[r] || 0,
      s = e.getValueForPixel(e.getPixelForValue(a + l) - t),
      m = e.getValueForPixel(e.getPixelForValue(i + l) - t),
      { min: u = -1 / 0, max: d = 1 / 0 } = (o && n && n[e.axis]) || {};
    return (
      !!(isNaN(s) || isNaN(m) || s < u || m > d) ||
      h(e, { min: s, max: m }, n, o)
    );
  }
  function b(e, t, n) {
    return x(e, t, n, !0);
  }
  const y = {
      category: function (e, t, n, o) {
        const a = d(e, t, n);
        return (
          e.min === e.max &&
            t < 1 &&
            (function (e) {
              const t = e.getLabels().length - 1;
              e.min > 0 && (e.min -= 1), e.max < t && (e.max += 1);
            })(e),
          h(e, { min: e.min + p(a.min), max: e.max - p(a.max) }, o, !0)
        );
      },
      default: function (e, t, n, o) {
        const a = d(e, t, n);
        return h(e, { min: e.min + a.min, max: e.max - a.max }, o, !0);
      },
    },
    v = {
      category: function (e, t, n) {
        const o = e.getLabels().length - 1;
        let { min: a, max: i } = e;
        const c = Math.max(i - a, 1),
          r = Math.round(
            (function (e) {
              return e.isHorizontal() ? e.width : e.height;
            })(e) / Math.max(c, 10)
          ),
          l = Math.round(Math.abs(t / r));
        let s;
        return (
          t < -r
            ? ((i = Math.min(i + l, o)),
              (a = 1 === c ? i : i - c),
              (s = i === o))
            : t > r &&
              ((a = Math.max(0, a - l)),
              (i = 1 === c ? a : a + c),
              (s = 0 === a)),
          h(e, { min: a, max: i }, n) || s
        );
      },
      default: x,
      logarithmic: b,
      timeseries: b,
    };
  function z(e, t) {
    n.each(e, (n, o) => {
      t[o] || delete e[o];
    });
  }
  function M(e, t) {
    const { scales: o } = e,
      { originalScaleLimits: a, updatedScaleLimits: i } = t;
    return (
      n.each(o, function (e) {
        (function (e, t, n) {
          const {
            id: o,
            options: { min: a, max: i },
          } = e;
          if (!t[o] || !n[o]) return !0;
          const c = n[o];
          return c.min !== a || c.max !== i;
        })(e, a, i) &&
          (a[e.id] = {
            min: { scale: e.min, options: e.options.min },
            max: { scale: e.max, options: e.options.max },
          });
      }),
      z(a, o),
      z(i, o),
      a
    );
  }
  function w(e, t, o, a) {
    const i = y[e.type] || y.default;
    n.callback(i, [e, t, o, a]);
  }
  function k(e) {
    const t = e.chartArea;
    return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
  }
  function S(e, t, o = "none") {
    const {
        x: a = 1,
        y: i = 1,
        focalPoint: c = k(e),
      } = "number" == typeof t ? { x: t, y: t } : t,
      r = u(e),
      {
        options: { limits: m, zoom: d },
      } = r,
      { mode: f = "xy", overScaleMode: h } = d || {};
    M(e, r);
    const p = 1 !== a && l(f, "x", e),
      g = 1 !== i && l(f, "y", e),
      x = h && s(h, c, e);
    n.each(x || e.scales, function (e) {
      e.isHorizontal() && p
        ? w(e, a, c, m)
        : !e.isHorizontal() && g && w(e, i, c, m);
    }),
      e.update(o),
      n.callback(d.onZoom, [{ chart: e }]);
  }
  function P(e, t, n) {
    const o = e.getValueForPixel(t),
      a = e.getValueForPixel(n);
    return { min: Math.min(o, a), max: Math.max(o, a) };
  }
  function C(e) {
    const t = u(e);
    let o = 1,
      a = 1;
    return (
      n.each(e.scales, function (e) {
        const i = (function (e, t) {
          const o = e.originalScaleLimits[t];
          if (!o) return;
          const { min: a, max: i } = o;
          return (
            n.valueOrDefault(i.options, i.scale) -
            n.valueOrDefault(a.options, a.scale)
          );
        })(t, e.id);
        if (i) {
          const t = Math.round((i / (e.max - e.min)) * 100) / 100;
          (o = Math.min(o, t)), (a = Math.max(a, t));
        }
      }),
      o < 1 ? o : a
    );
  }
  function j(e, t, o, a) {
    const { panDelta: i } = a,
      c = i[e.id] || 0;
    n.sign(c) === n.sign(t) && (t += c);
    const r = v[e.type] || v.default;
    n.callback(r, [e, t, o]) ? (i[e.id] = 0) : (i[e.id] = t);
  }
  function Z(e, t, o, a = "none") {
    const { x: i = 0, y: c = 0 } = "number" == typeof t ? { x: t, y: t } : t,
      r = u(e),
      {
        options: { pan: s, limits: m },
      } = r,
      { mode: d = "xy", onPan: f } = s || {};
    M(e, r);
    const h = 0 !== i && l(d, "x", e),
      p = 0 !== c && l(d, "y", e);
    n.each(o || e.scales, function (e) {
      e.isHorizontal() && h
        ? j(e, i, m, r)
        : !e.isHorizontal() && p && j(e, c, m, r);
    }),
      e.update(a),
      n.callback(f, [{ chart: e }]);
  }
  function R(e, t) {
    const { handlers: n } = u(e),
      o = n[t];
    o && o.target && (o.target.removeEventListener(t, o), delete n[t]);
  }
  function Y(e, t, n, o) {
    const { handlers: a, options: i } = u(e);
    R(e, n),
      (a[n] = (t) => o(e, t, i)),
      (a[n].target = t),
      t.addEventListener(n, a[n]);
  }
  function L(e, t) {
    const n = u(e);
    n.dragStart && ((n.dragging = !0), (n.dragEnd = t), e.update("none"));
  }
  function T(e, t, o) {
    const { onZoomStart: a, onZoomRejected: i } = o;
    if (a) {
      const { left: o, top: c } = t.target.getBoundingClientRect(),
        r = { x: t.clientX - o, y: t.clientY - c };
      if (!1 === n.callback(a, [{ chart: e, event: t, point: r }]))
        return n.callback(i, [{ chart: e, event: t }]), !1;
    }
  }
  function X(e, t) {
    const o = u(e),
      { pan: a, zoom: l = {} } = o.options;
    if (c(i(a), t) || r(i(l.drag), t))
      return n.callback(l.onZoomRejected, [{ chart: e, event: t }]);
    !1 !== T(e, t, l) && ((o.dragStart = t), Y(e, e.canvas, "mousemove", L));
  }
  function D(e, t, n, o) {
    const { left: a, top: i } = n.target.getBoundingClientRect(),
      c = l(t, "x", e),
      r = l(t, "y", e);
    let {
      top: s,
      left: m,
      right: u,
      bottom: d,
      width: f,
      height: h,
    } = e.chartArea;
    c &&
      ((m = Math.min(n.clientX, o.clientX) - a),
      (u = Math.max(n.clientX, o.clientX) - a)),
      r &&
        ((s = Math.min(n.clientY, o.clientY) - i),
        (d = Math.max(n.clientY, o.clientY) - i));
    const p = u - m,
      g = d - s;
    return {
      left: m,
      top: s,
      right: u,
      bottom: d,
      width: p,
      height: g,
      zoomX: c && p ? 1 + (f - p) / f : 1,
      zoomY: r && g ? 1 + (h - g) / h : 1,
    };
  }
  function E(e, t) {
    const o = u(e);
    if (!o.dragStart) return;
    R(e, "mousemove");
    const {
        mode: a,
        onZoomComplete: i,
        drag: { threshold: c = 0 },
      } = o.options.zoom,
      r = D(e, a, o.dragStart, t),
      s = l(a, "x", e) ? r.width : 0,
      m = l(a, "y", e) ? r.height : 0,
      d = Math.sqrt(s * s + m * m);
    if (((o.dragStart = o.dragEnd = null), d <= c))
      return (o.dragging = !1), void e.update("none");
    !(function (e, t, o, a = "none") {
      const i = u(e),
        {
          options: { limits: c, zoom: r },
        } = i,
        { mode: s = "xy" } = r;
      M(e, i);
      const m = l(s, "x", e),
        d = l(s, "y", e);
      n.each(e.scales, function (e) {
        e.isHorizontal() && m
          ? h(e, P(e, t.x, o.x), c, !0)
          : !e.isHorizontal() && d && h(e, P(e, t.y, o.y), c, !0);
      }),
        e.update(a),
        n.callback(r.onZoom, [{ chart: e }]);
    })(e, { x: r.left, y: r.top }, { x: r.right, y: r.bottom }, "zoom"),
      setTimeout(() => (o.dragging = !1), 500),
      n.callback(i, [{ chart: e }]);
  }
  function F(e, t) {
    const {
      handlers: { onZoomComplete: o },
      options: { zoom: a },
    } = u(e);
    if (
      !(function (e, t, o) {
        if (r(i(o.wheel), t))
          n.callback(o.onZoomRejected, [{ chart: e, event: t }]);
        else if (
          !1 !== T(e, t, o) &&
          (t.cancelable && t.preventDefault(), void 0 !== t.deltaY)
        )
          return !0;
      })(e, t, a)
    )
      return;
    const c = t.target.getBoundingClientRect(),
      l = 1 + (t.deltaY >= 0 ? -a.wheel.speed : a.wheel.speed);
    S(e, {
      x: l,
      y: l,
      focalPoint: { x: t.clientX - c.left, y: t.clientY - c.top },
    }),
      o && o();
  }
  function H(e, t, o, a) {
    o &&
      (u(e).handlers[t] = (function (e, t) {
        let n;
        return function () {
          return clearTimeout(n), (n = setTimeout(e, t)), t;
        };
      })(() => n.callback(o, [{ chart: e }]), a));
  }
  function O(e, t) {
    return function (o, a) {
      const { pan: l, zoom: s = {} } = t.options;
      if (!l || !l.enabled) return !1;
      const m = a && a.srcEvent;
      return (
        !m ||
        !(
          !t.panning &&
          "mouse" === a.pointerType &&
          (r(i(l), m) || c(i(s.drag), m))
        ) ||
        (n.callback(l.onPanRejected, [{ chart: e, event: a }]), !1)
      );
    };
  }
  function V(e, t, n) {
    if (t.scale) {
      const { center: o, pointers: a } = n,
        i = (1 / t.scale) * n.scale,
        c = n.target.getBoundingClientRect(),
        r = (function (e, t) {
          const n = Math.abs(e.clientX - t.clientX),
            o = Math.abs(e.clientY - t.clientY),
            a = n / o;
          let i, c;
          return (
            a > 0.3 && a < 1.7 ? (i = c = !0) : n > o ? (i = !0) : (c = !0),
            { x: i, y: c }
          );
        })(a[0], a[1]),
        s = t.options.zoom.mode;
      S(e, {
        x: r.x && l(s, "x", e) ? i : 1,
        y: r.y && l(s, "y", e) ? i : 1,
        focalPoint: { x: o.x - c.left, y: o.y - c.top },
      }),
        (t.scale = n.scale);
    }
  }
  function K(e, t, n) {
    const o = t.delta;
    o &&
      ((t.panning = !0),
      Z(e, { x: n.deltaX - o.x, y: n.deltaY - o.y }, t.panScales),
      (t.delta = { x: n.deltaX, y: n.deltaY }));
  }
  const N = new WeakMap();
  function q(e, t) {
    const o = u(e),
      i = e.canvas,
      { pan: c, zoom: r } = t,
      l = new a.default.Manager(i);
    r &&
      r.pinch.enabled &&
      (l.add(new a.default.Pinch()),
      l.on("pinchstart", () =>
        (function (e, t) {
          t.options.zoom.pinch.enabled && (t.scale = 1);
        })(0, o)
      ),
      l.on("pinch", (t) => V(e, o, t)),
      l.on("pinchend", (t) =>
        (function (e, t, o) {
          t.scale &&
            (V(e, t, o),
            (t.scale = null),
            n.callback(t.options.zoom.onZoomComplete, [{ chart: e }]));
        })(e, o, t)
      )),
      c &&
        c.enabled &&
        (l.add(new a.default.Pan({ threshold: c.threshold, enable: O(e, o) })),
        l.on("panstart", (t) =>
          (function (e, t, o) {
            const {
              enabled: a,
              overScaleMode: i,
              onPanStart: c,
              onPanRejected: r,
            } = t.options.pan;
            if (!a) return;
            const l = o.target.getBoundingClientRect(),
              m = { x: o.center.x - l.left, y: o.center.y - l.top };
            if (!1 === n.callback(c, [{ chart: e, event: o, point: m }]))
              return n.callback(r, [{ chart: e, event: o }]);
            (t.panScales = i && s(i, m, e)),
              (t.delta = { x: 0, y: 0 }),
              clearTimeout(t.panEndTimeout),
              K(e, t, o);
          })(e, o, t)
        ),
        l.on("panmove", (t) => K(e, o, t)),
        l.on("panend", () =>
          (function (e, t) {
            (t.delta = null),
              t.panning &&
                ((t.panEndTimeout = setTimeout(() => (t.panning = !1), 500)),
                n.callback(t.options.pan.onPanComplete, [{ chart: e }]));
          })(e, o)
        )),
      N.set(e, l);
  }
  var B = {
    id: "zoom",
    version: "1.1.1",
    defaults: {
      pan: { enabled: !1, mode: "xy", threshold: 10, modifierKey: null },
      zoom: {
        wheel: { enabled: !1, speed: 0.1, modifierKey: null },
        drag: { enabled: !1, modifierKey: null },
        pinch: { enabled: !1 },
        mode: "xy",
      },
    },
    start: function (e, t, o) {
      (u(e).options = o),
        Object.prototype.hasOwnProperty.call(o.zoom, "enabled") &&
          console.warn(
            "The option `zoom.enabled` is no longer supported. Please use `zoom.wheel.enabled`, `zoom.drag.enabled`, or `zoom.pinch.enabled`."
          ),
        a.default && q(e, o),
        (e.pan = (t, n, o) => Z(e, t, n, o)),
        (e.zoom = (t, n) => S(e, t, n)),
        (e.zoomScale = (t, n, o) =>
          (function (e, t, n, o = "none") {
            M(e, u(e)), h(e.scales[t], n, void 0, !0), e.update(o);
          })(e, t, n, o)),
        (e.resetZoom = (t) =>
          (function (e, t = "default") {
            const o = u(e),
              a = M(e, o);
            n.each(e.scales, function (e) {
              const t = e.options;
              a[e.id]
                ? ((t.min = a[e.id].min.options), (t.max = a[e.id].max.options))
                : (delete t.min, delete t.max);
            }),
              e.update(t),
              n.callback(o.options.zoom.onZoomComplete, [{ chart: e }]);
          })(e, t)),
        (e.getZoomLevel = () => C(e));
    },
    beforeEvent(e) {
      const t = u(e);
      if (t.panning || t.dragging) return !1;
    },
    beforeUpdate: function (e, t, n) {
      (u(e).options = n),
        (function (e, t) {
          const n = e.canvas,
            { wheel: o, drag: a, onZoomComplete: i } = t.zoom;
          o.enabled
            ? (Y(e, n, "wheel", F), H(e, "onZoomComplete", i, 250))
            : R(e, "wheel"),
            a.enabled
              ? (Y(e, n, "mousedown", X), Y(e, n.ownerDocument, "mouseup", E))
              : (R(e, "mousedown"), R(e, "mousemove"), R(e, "mouseup"));
        })(e, n);
    },
    beforeDatasetsDraw: function (e, t, n) {
      const { dragStart: o, dragEnd: a } = u(e);
      if (a) {
        const {
            left: t,
            top: i,
            width: c,
            height: r,
          } = D(e, n.zoom.mode, o, a),
          l = n.zoom.drag,
          s = e.ctx;
        s.save(),
          s.beginPath(),
          (s.fillStyle = l.backgroundColor || "rgba(225,225,225,0.3)"),
          s.fillRect(t, i, c, r),
          l.borderWidth > 0 &&
            ((s.lineWidth = l.borderWidth),
            (s.strokeStyle = l.borderColor || "rgba(225,225,225)"),
            s.strokeRect(t, i, c, r)),
          s.restore();
      }
    },
    stop: function (e) {
      !(function (e) {
        R(e, "mousedown"),
          R(e, "mousemove"),
          R(e, "mouseup"),
          R(e, "wheel"),
          R(e, "click");
      })(e),
        a.default &&
          (function (e) {
            const t = N.get(e);
            t &&
              (t.remove("pinchstart"),
              t.remove("pinch"),
              t.remove("pinchend"),
              t.remove("panstart"),
              t.remove("pan"),
              t.remove("panend"),
              t.destroy(),
              N.delete(e));
          })(e),
        (function (e) {
          m.delete(e);
        })(e);
    },
    panFunctions: v,
    zoomFunctions: y,
  };
  return e.Chart.register(B), B;
});
